import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Trophy,
  Bell,
  FileText,
  Shield,
  LogOut,
  User,
  Ruler,
  Activity,
  Heart,
  Stethoscope,
  Target,
  Flame,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();
  const { signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<"info" | "evolution" | "achievements" | "settings">("info");

  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const resetChecklist = async () => {
    localStorage.removeItem("levvia_challenge_progress");
    // Also reset in Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ challenge_progress: {} }).eq("id", user.id);
    }
    toast({ title: "Checklist resetado", description: "Seu progresso de hoje foi reiniciado." });
    window.location.reload();
  };

  const resetOnboarding = async () => {
    localStorage.removeItem("levvia_onboarded");
    localStorage.removeItem("levvia_onboarding");
    localStorage.removeItem("levvia_checklist");
    localStorage.removeItem("levvia_challenge_start");
    localStorage.removeItem("levvia_challenge_progress");
    localStorage.removeItem("levvia_welcome_dismissed");
    localStorage.removeItem("levvia_meal_plan");
    // Reset profile in Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        onboarding_data: {},
        challenge_progress: {},
        challenge_start: null,
        pain_level: "",
        objective: "",
        affected_areas: [],
        age: null,
        sex: "",
        weight_kg: null,
        height_cm: null,
        activity_level: "",
        health_conditions: [],
      }).eq("id", user.id);
    }
    window.location.href = "/onboarding";
  };

  const bmi = profile.weightKg && profile.heightCm
    ? (profile.weightKg / ((profile.heightCm / 100) ** 2)).toFixed(1)
    : null;

  const profileItems = [
    { icon: User, label: "Nome", value: profile.name || "—" },
    { icon: User, label: "Idade", value: profile.age ? `${profile.age} anos` : "—" },
    { icon: User, label: "Sexo", value: profile.sex || "—" },
    { icon: Ruler, label: "Peso", value: profile.weightKg ? `${profile.weightKg} kg` : "—" },
    { icon: Ruler, label: "Altura", value: profile.heightCm ? `${profile.heightCm} cm` : "—" },
    { icon: Ruler, label: "IMC", value: bmi ? `${bmi}` : "—" },
    { icon: Activity, label: "Nível de atividade", value: profile.activityLevel || "—" },
    { icon: Flame, label: "Nível de dor", value: profile.painLevel || "—" },
    { icon: Target, label: "Objetivo", value: profile.objective || "—" },
  ];

  const conditionItems = [
    {
      icon: Stethoscope,
      label: "Condições de saúde",
      value: profile.healthConditions?.length ? profile.healthConditions.join(", ") : "Nenhuma informada",
    },
    {
      icon: Heart,
      label: "Áreas afetadas",
      value: profile.affectedAreas?.length ? profile.affectedAreas.join(", ") : "Nenhuma informada",
    },
  ];

  const sections = [
    { id: "info" as const, label: "Informações", icon: Settings },
    { id: "evolution" as const, label: "Evolução", icon: TrendingUp },
    { id: "achievements" as const, label: "Conquistas", icon: Trophy },
    { id: "settings" as const, label: "Configurações", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background gradient-page pb-24">
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <img src={logoIcon} alt="Levvia" className="w-10 h-auto" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-light text-foreground">{profile.name || "Usuária"}</h1>
            <p className="text-sm text-muted-foreground">Membro Levvia</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-white/[0.06] text-muted-foreground border border-white/10 hover:border-destructive/30 hover:text-destructive transition-all"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Sair
          </button>
        </div>
      </header>

      {/* Section tabs */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full font-medium transition-all ${
                activeSection === s.id
                  ? "bg-secondary text-foreground"
                  : "bg-white/[0.06] text-muted-foreground border border-white/10"
              }`}
            >
              <s.icon size={14} strokeWidth={1.5} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 space-y-6">
        {/* Info section */}
        {activeSection === "info" && (
          <>
            {/* Personal data */}
            <section className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User size={16} strokeWidth={1.5} className="text-secondary" />
                  Dados Pessoais
                </h2>
              </div>
              {profileItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-0"
                >
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon size={14} strokeWidth={1.5} className="text-secondary/60" />
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%] truncate">
                    {item.value}
                  </span>
                </div>
              ))}
            </section>

            {/* Health conditions */}
            <section className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Stethoscope size={16} strokeWidth={1.5} className="text-secondary" />
                  Saúde
                </h2>
              </div>
              {conditionItems.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-3 border-b border-white/10 last:border-0"
                >
                  <span className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <item.icon size={14} strokeWidth={1.5} className="text-secondary/60" />
                    {item.label}
                  </span>
                  <p className="text-sm font-medium text-foreground pl-6">{item.value}</p>
                </div>
              ))}
            </section>

            {/* Actions */}
            <section className="space-y-3">
              <button
                onClick={resetChecklist}
                className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <RotateCcw size={18} strokeWidth={1.5} className="text-secondary" />
                  Resetar checklist de hoje
                </span>
                <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
              <button
                onClick={resetOnboarding}
                className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <RotateCcw size={18} strokeWidth={1.5} className="text-destructive" />
                  Refazer questionário inicial
                </span>
                <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
            </section>
          </>
        )}

        {/* Evolution section */}
        {activeSection === "evolution" && (
          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} strokeWidth={1.5} className="text-secondary" />
              <h2 className="text-base font-medium text-foreground">Sua Evolução</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <TrendingUp size={32} strokeWidth={1.5} className="text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
                Em breve você poderá acompanhar sua evolução com gráficos de progresso diário, semanal e mensal.
              </p>
              <span className="text-xs text-secondary font-medium mt-3 bg-secondary/20 px-3 py-1 rounded-full">
                Em breve
              </span>
            </div>
          </section>
        )}

        {/* Achievements section */}
        {activeSection === "achievements" && (
          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} strokeWidth={1.5} className="text-accent" />
              <h2 className="text-base font-medium text-foreground">Conquistas</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { emoji: "🌱", label: "Primeiro Passo", desc: "Completou o onboarding" },
                { emoji: "💧", label: "Hidratada", desc: "Complete 7 dias de hidratação" },
                { emoji: "🏃‍♀️", label: "Em Movimento", desc: "Complete 7 dias de exercícios" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center p-3 rounded-xl bg-white/[0.06] border border-white/10"
                >
                  <span className="text-2xl mb-1">{badge.emoji}</span>
                  <span className="text-xs font-medium text-foreground text-center">{badge.label}</span>
                  <span className="text-[10px] text-muted-foreground text-center mt-0.5">{badge.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Continue completando suas tarefas diárias para desbloquear mais conquistas!
            </p>
          </section>
        )}

        {/* Settings section */}
        {activeSection === "settings" && (
          <section className="space-y-3">
            {[
              { icon: Bell, label: "Notificações", desc: "Em breve" },
              { icon: FileText, label: "Termos de Uso", desc: "" },
              { icon: Shield, label: "Política de Privacidade", desc: "" },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <item.icon size={18} strokeWidth={1.5} className="text-secondary" />
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  {item.desc && (
                    <span className="text-xs text-secondary font-medium bg-secondary/20 px-2 py-0.5 rounded-full">
                      {item.desc}
                    </span>
                  )}
                  <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
                </div>
              </button>
            ))}

            {/* Logout in settings too */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-destructive">
                <LogOut size={18} strokeWidth={1.5} />
                Sair da conta
              </span>
              <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
            </button>
          </section>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed px-4">
          Os conteúdos do Levvia são informativos e não substituem orientação médica profissional.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
