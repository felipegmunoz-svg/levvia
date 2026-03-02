import { useState, useEffect } from "react";
import { Heart, Settings, ChevronRight, RotateCcw, TrendingUp, Trophy, Bell, FileText, Shield } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const [onboardingData, setOnboardingData] = useState<Record<string, string | string[]>>({});
  const [activeSection, setActiveSection] = useState<"info" | "evolution" | "achievements" | "settings">("info");

  useEffect(() => {
    const saved = localStorage.getItem("lipevida_onboarding");
    if (saved) setOnboardingData(JSON.parse(saved));
  }, []);

  const userName = (onboardingData[2] as string) || "Usuária";

  const resetChecklist = () => {
    localStorage.removeItem("lipevida_checklist");
    localStorage.removeItem("lipevida_challenge_progress");
    window.location.reload();
  };

  const resetOnboarding = () => {
    localStorage.removeItem("lipevida_onboarded");
    localStorage.removeItem("lipevida_onboarding");
    localStorage.removeItem("lipevida_checklist");
    localStorage.removeItem("lipevida_challenge_start");
    localStorage.removeItem("lipevida_challenge_progress");
    localStorage.removeItem("lipevida_welcome_dismissed");
    window.location.href = "/";
  };

  const profileItems = [
    { label: "Nome", value: onboardingData[2] || "—" },
    { label: "Nível de dor", value: onboardingData[3] || "—" },
    { label: "Áreas afetadas", value: Array.isArray(onboardingData[4]) ? onboardingData[4].join(", ") : "—" },
    { label: "Objetivo principal", value: onboardingData[8] || "—" },
  ];

  const sections = [
    { id: "info" as const, label: "Informações", icon: Settings },
    { id: "evolution" as const, label: "Evolução", icon: TrendingUp },
    { id: "achievements" as const, label: "Conquistas", icon: Trophy },
    { id: "settings" as const, label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
            <Heart size={28} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">{userName}</h1>
            <p className="text-sm text-muted-foreground">Membro LipeVida</p>
          </div>
        </div>
      </header>

      {/* Section tabs */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full font-bold transition-all ${
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <s.icon size={14} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 space-y-6">
        {/* Info section */}
        {activeSection === "info" && (
          <>
            <section className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Settings size={16} className="text-primary" />
                  Suas Informações
                </h2>
              </div>
              {profileItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground text-right max-w-[60%] truncate">
                    {typeof item.value === "string" ? item.value : "—"}
                  </span>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <button
                onClick={resetChecklist}
                className="flex items-center justify-between w-full px-4 py-3.5 bg-card rounded-xl shadow-card hover:shadow-soft transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-foreground">
                  <RotateCcw size={18} className="text-primary" />
                  Resetar checklist de hoje
                </span>
                <ChevronRight size={18} className="text-muted-foreground" />
              </button>
              <button
                onClick={resetOnboarding}
                className="flex items-center justify-between w-full px-4 py-3.5 bg-card rounded-xl shadow-card hover:shadow-soft transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-foreground">
                  <RotateCcw size={18} className="text-destructive" />
                  Refazer questionário inicial
                </span>
                <ChevronRight size={18} className="text-muted-foreground" />
              </button>
            </section>
          </>
        )}

        {/* Evolution section */}
        {activeSection === "evolution" && (
          <section className="bg-card rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">Sua Evolução</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-4">
                <TrendingUp size={32} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
                Em breve você poderá acompanhar sua evolução com gráficos de progresso diário, semanal e mensal.
              </p>
              <span className="text-xs text-primary font-bold mt-3 bg-primary-light px-3 py-1 rounded-full">
                Em breve
              </span>
            </div>
          </section>
        )}

        {/* Achievements section */}
        {activeSection === "achievements" && (
          <section className="bg-card rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-accent-foreground" />
              <h2 className="text-base font-bold text-foreground">Conquistas</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { emoji: "🌱", label: "Primeiro Passo", desc: "Completou o onboarding" },
                { emoji: "💧", label: "Hidratada", desc: "Complete 7 dias de hidratação" },
                { emoji: "🏃‍♀️", label: "Em Movimento", desc: "Complete 7 dias de exercícios" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center p-3 rounded-xl bg-secondary/50"
                >
                  <span className="text-2xl mb-1">{badge.emoji}</span>
                  <span className="text-xs font-bold text-foreground text-center">{badge.label}</span>
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
                className="flex items-center justify-between w-full px-4 py-3.5 bg-card rounded-xl shadow-card hover:shadow-soft transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-foreground">
                  <item.icon size={18} className="text-primary" />
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  {item.desc && (
                    <span className="text-xs text-primary font-bold bg-primary-light px-2 py-0.5 rounded-full">
                      {item.desc}
                    </span>
                  )}
                  <ChevronRight size={18} className="text-muted-foreground" />
                </div>
              </button>
            ))}
          </section>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed px-4">
          Os conteúdos do LipeVida são informativos e não substituem orientação médica profissional.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
