import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/today", { replace: true });
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
            {isLogin ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {isLogin
              ? "Acesse sua conta Levvia"
              : "Comece sua jornada de cuidado"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required={!isLogin}
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
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Senha</Label>
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-foreground font-medium"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-secondary hover:underline font-medium"
          >
            {isLogin ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
