import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(() => {
    const raw = localStorage.getItem("levvia_onboarding");
    if (raw) {
      try { return (JSON.parse(raw)[2] as string) || ""; } catch { return ""; }
    }
    return "";
  });

  /** Sync pending onboarding data from localStorage to Supabase profile */
  const syncOnboardingData = async (userId?: string) => {
    if (!userId) return;
    const raw = localStorage.getItem("levvia_onboarding");
    if (!raw) return;

    try {
      const answers = JSON.parse(raw) as Record<number, string | string[]>;
      const userName = (answers[2] as string) || "";
      const age = parseInt(answers[3] as string) || null;
      const sex = (answers[4] as string) || "";
      const bodyMetrics = (answers[5] as string[]) || [];
      const weightKg = parseFloat(bodyMetrics[0]) || null;
      const heightCm = parseFloat(bodyMetrics[1]) || null;
      const activityLevel = (answers[6] as string) || "";
      const healthConditions = (answers[7] as string[]) || [];
      const painLevel = (answers[8] as string) || "";
      const affectedAreas = (answers[9] as string[]) || [];
      const objective = (answers[13] as string) || "";

      await supabase.from("profiles").update({
        name: userName,
        age,
        sex,
        weight_kg: weightKg,
        height_cm: heightCm,
        activity_level: activityLevel,
        health_conditions: healthConditions,
        pain_level: painLevel,
        affected_areas: affectedAreas,
        objective,
        onboarding_data: {
          enemies: answers[11] || [],
          allies: answers[12] || [],
          restrictions: answers[14] || [],
          preferences: answers[15] || [],
          raw: answers,
        },
      }).eq("id", userId);

      // Clean up after sync
      localStorage.removeItem("levvia_onboarding");
      localStorage.removeItem("levvia_selected_plan");
    } catch (e) {
      console.error("Failed to sync onboarding data:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      } else if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await syncOnboardingData(data.user?.id);
        const hasPlan = localStorage.getItem("levvia_selected_plan");
        navigate(hasPlan ? "/checkout" : "/today", { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        await syncOnboardingData(undefined);
        toast({
          title: "Conta criada!",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-white/[0.06] border-white/10 text-foreground placeholder:text-muted-foreground"
              />
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
