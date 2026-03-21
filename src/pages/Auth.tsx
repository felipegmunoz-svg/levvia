import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { readOnboardingSnapshot, syncOnboardingToSupabase } from "@/lib/syncOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ message: string; destination: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(() => {
    const raw = localStorage.getItem("levvia_onboarding");
    if (raw) {
      try { return (JSON.parse(raw)[2] as string) || ""; } catch { return ""; }
    }
    return "";
  });

  /** Read onboarding snapshot from localStorage BEFORE auth changes anything */
  const readOnboardingSnapshot = () => {
    const raw = localStorage.getItem("levvia_onboarding");
    const pantryBackup = localStorage.getItem("levvia_pantry_items");
    const objectivesBackup = localStorage.getItem("levvia_objectives");
    const restrictionsBackup = localStorage.getItem("levvia_restrictions");

    console.log('📸 Snapshot — raw localStorage:', raw ? 'EXISTE (' + raw.length + ' chars)' : 'VAZIO');

    let answers: Record<number, string | string[]> = {};
    if (raw) {
      try { answers = JSON.parse(raw); } catch { /* ignore */ }
    }

    console.log('📸 Snapshot — answers[15] (pantry):', JSON.stringify(answers[15]));
    console.log('📸 Snapshot — answers[16] (objectives):', JSON.stringify(answers[16]));
    console.log('📸 Snapshot — answers[13] (restrictions):', JSON.stringify(answers[13]));

    // Resolve pantry: PREFER backup over answers (backup is written synchronously at interaction time)
    let pantryItems: string[] = [];
    if (pantryBackup) {
      try { pantryItems = JSON.parse(pantryBackup); } catch { /* ignore */ }
    }
    if ((!pantryItems || pantryItems.length === 0) && answers[15]) {
      pantryItems = (answers[15] as string[]) || [];
    }

    // Resolve objectives: PREFER backup over answers
    let objectives: string[] = [];
    if (objectivesBackup) {
      try { objectives = JSON.parse(objectivesBackup); } catch { /* ignore */ }
    }
    if ((!objectives || objectives.length === 0) && answers[16]) {
      objectives = (answers[16] as string[]) || [];
    }

    // Resolve restrictions: PREFER backup over answers
    let restrictions: string[] = [];
    if (restrictionsBackup) {
      try { restrictions = JSON.parse(restrictionsBackup); } catch { /* ignore */ }
    }
    if ((!restrictions || restrictions.length === 0) && answers[13]) {
      restrictions = (answers[13] as string[]) || [];
    }

    console.log('📸 Snapshot — pantryItems FINAL:', JSON.stringify(pantryItems));
    console.log('📸 Snapshot — objectives FINAL:', JSON.stringify(objectives));
    console.log('📸 Snapshot — restrictions FINAL:', JSON.stringify(restrictions));

    return { answers, pantryItems, objectives, restrictions, hasData: !!raw };
  };

  /** Ensure profile exists and sync onboarding data to Supabase */
  const syncProfileData = async (
    snapshot: ReturnType<typeof readOnboardingSnapshot>,
    userId?: string,
    userEmail?: string,
  ) => {
    if (!userId) return;

    // Small delay to let trigger create the profile first
    await new Promise((r) => setTimeout(r, 500));

    console.log('💾 Sync — snapshot recebido, hasData:', snapshot.hasData);
    console.log('💾 Sync — pantry_items FINAL a salvar:', JSON.stringify(snapshot.pantryItems));

    try {
      // Build profile payload from snapshot OR form fields
      let profileData: Record<string, unknown> = {
        name: name || "",
        phone: phone || null,
      };

      if (snapshot.hasData) {
        const { answers, pantryItems, objectives, restrictions } = snapshot;
        const userName = (answers[2] as string) || name || "";
        const age = parseInt(answers[3] as string) || null;
        const sex = (answers[4] as string) || "";
        const bodyMetrics = (answers[5] as string[]) || [];
        const weightKg = parseFloat(bodyMetrics[0]) || null;
        const heightCm = parseFloat(bodyMetrics[1]) || null;
        const activityLevel = (answers[6] as string) || "";
        const healthConditions = (answers[7] as string[]) || [];
        const painLevel = (answers[8] as string) || "";
        const affectedAreas = (answers[9] as string[]) || [];

        console.log('💾 Sync — objectives FINAL a salvar:', JSON.stringify(objectives));
        console.log('💾 Sync — restrictions FINAL a salvar:', JSON.stringify(restrictions));
        console.log('💾 Sync — pantry_items FINAL a salvar:', JSON.stringify(pantryItems));

        profileData = {
          name: userName,
          phone: phone || null,
          age,
          sex,
          weight_kg: weightKg,
          height_cm: heightCm,
          activity_level: activityLevel,
          health_conditions: healthConditions,
          pain_level: painLevel,
          affected_areas: affectedAreas,
          objectives,
          pantry_items: pantryItems,
          onboarding_data: {
            enemies: answers[11] || [],
            allies: answers[12] || [],
            restrictions,
            preferences: answers[14] || [],
            raw: answers,
          },
        };
      }

      console.log('💾 Sync — payload completo:', JSON.stringify(profileData));

      // Try update first (trigger should have created the row)
      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId)
        .select("id");

      if (updateError) {
        console.error("💾 Sync — update failed:", updateError.message);
      } else {
        console.log('💾 Sync — update result:', updated?.length, 'rows');
      }

      // If no row was updated, insert as fallback
      if (!updateError && (!updated || updated.length === 0)) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          email: userEmail || email || "",
          ...profileData,
        });
        if (insertError) {
          console.error("💾 Sync — insert failed:", insertError.message);
        } else {
          console.log('💾 Sync — insert OK');
        }
      }

      // Only clean up AFTER successful sync
      const syncSuccess = !updateError || (updated && updated.length > 0);
      if (syncSuccess) {
        console.log('💾 Sync — sucesso! Limpando localStorage...');
        localStorage.removeItem("levvia_onboarding");
        localStorage.removeItem("levvia_pantry_items");
        localStorage.removeItem("levvia_objectives");
        localStorage.removeItem("levvia_restrictions");
      } else {
        console.warn('💾 Sync — falhou, mantendo localStorage para retry');
      }
    } catch (e) {
      console.error("💾 Sync — erro geral:", e);
      // Do NOT clear localStorage on error — data preserved for retry
    }
  };

  const showSuccessAndNavigate = (destination: string, isSignup: boolean) => {
    const message = isSignup ? "Conta criada com sucesso!" : "Bem-vinda de volta!";
    setLoading(false);
    setSuccess({ message, destination });
    setTimeout(() => {
      navigate(destination, { replace: true });
    }, 1800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Capture snapshot BEFORE auth — deterministic read
    const snapshot = readOnboardingSnapshot();

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
        setMode("login");
        setLoading(false);
      } else if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await syncProfileData(snapshot, data.user?.id, data.user?.email);
        showSuccessAndNavigate("/today", false);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone },
          },
        });
        if (error) throw error;
        await syncProfileData(snapshot, data.user?.id, data.user?.email);
        showSuccessAndNavigate("/today", true);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6"
            >
              <Check className="w-10 h-10 text-foreground" strokeWidth={2.5} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-medium text-foreground mb-2"
            >
              {success.message}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-secondary"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Preparando tudo para você...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <img src={logoIcon} alt="Levvia" className="w-10 h-auto" />
          </div>
          <h1 className="text-2xl font-light text-foreground">
            {mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha"}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {mode === "login"
              ? "Acesse sua conta Levvia"
              : mode === "signup"
              ? "Comece sua jornada de cuidado"
              : "Enviaremos um link para redefinir sua senha"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="bg-white/[0.06] border-white/10 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Celular / WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                    let formatted = digits;
                    if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
                    if (digits.length > 7) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
                    setPhone(formatted);
                  }}
                  placeholder="(11) 99999-9999"
                  required
                  className="bg-white/[0.06] border-white/10 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-white/[0.06] border-white/10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Senha</Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-secondary hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-white/[0.06] border-white/10 text-foreground placeholder:text-muted-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-foreground font-medium"
          >
            {loading
              ? "Carregando..."
              : mode === "login"
              ? "Entrar"
              : mode === "signup"
              ? "Criar conta"
              : "Enviar link de recuperação"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          {mode === "login" ? (
            <>
              Não tem conta?{" "}
              <button onClick={() => setMode("signup")} className="text-secondary hover:underline font-medium">
                Criar conta
              </button>
            </>
          ) : mode === "signup" ? (
            <>
              Já tem conta?{" "}
              <button onClick={() => setMode("login")} className="text-secondary hover:underline font-medium">
                Entrar
              </button>
            </>
          ) : (
            <>
              Lembrou a senha?{" "}
              <button onClick={() => setMode("login")} className="text-secondary hover:underline font-medium">
                Voltar para login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
