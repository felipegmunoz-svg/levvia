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

  /** Sync onboarding data to Supabase using shared helper */
  const syncProfileData = async (userId?: string, userEmail?: string) => {
    if (!userId) return;

    // Check if we have an active session (needed for RLS)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('💾 Sync — sem sessão ativa, adiando sync para Day1Flow');
      return;
    }

    // Small delay to let trigger create the profile first
    await new Promise((r) => setTimeout(r, 500));

    const snapshot = readOnboardingSnapshot();
    await syncOnboardingToSupabase(snapshot, userId, {
      name: name || undefined,
      phone: phone || undefined,
      email: userEmail || email || undefined,
    });
  };

  const showSuccessAndNavigate = (destination: string, isSignup: boolean) => {
    const message = isSignup ? "Conta criada com sucesso!" : "Bem-vinda de volta!";
    setLoading(false);
    setSuccess({ message, destination });
    const timer = setTimeout(() => {
      navigate(destination, { replace: true });
    }, 1800);
    // Store timer ref for potential cleanup (component will unmount on navigate)
    return () => clearTimeout(timer);
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
        setLoading(false);
      } else if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await syncProfileData(data.user?.id, data.user?.email);
        const onboarded = localStorage.getItem("levvia_onboarded") === "true";
        showSuccessAndNavigate(onboarded ? "/today" : "/onboarding", false);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone },
          },
        });
        if (error) throw error;
        await syncProfileData(data.user?.id, data.user?.email);
        const onboarded = localStorage.getItem("levvia_onboarded") === "true";
        showSuccessAndNavigate(onboarded ? "/today" : "/onboarding", true);
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
