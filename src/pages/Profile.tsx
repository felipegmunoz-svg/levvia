import { useState, useEffect } from "react";
import { Heart, Settings, ChevronRight, RotateCcw } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const [onboardingData, setOnboardingData] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem("lipevida_onboarding");
    if (saved) setOnboardingData(JSON.parse(saved));
  }, []);

  const resetChecklist = () => {
    localStorage.removeItem("lipevida_checklist");
    window.location.reload();
  };

  const resetOnboarding = () => {
    localStorage.removeItem("lipevida_onboarded");
    localStorage.removeItem("lipevida_onboarding");
    localStorage.removeItem("lipevida_checklist");
    window.location.href = "/";
  };

  const profileItems = [
    { label: "Faixa etária", value: onboardingData[1] || "—" },
    { label: "Diagnóstico", value: onboardingData[2] || "—" },
    { label: "Nível de dor", value: onboardingData[3] || "—" },
    { label: "Áreas afetadas", value: Array.isArray(onboardingData[4]) ? onboardingData[4].join(", ") : "—" },
    { label: "Atividade física", value: onboardingData[5] || "—" },
    { label: "Objetivos", value: Array.isArray(onboardingData[6]) ? onboardingData[6].join(", ") : "—" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
            <Heart size={28} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Meu Perfil</h1>
            <p className="text-sm text-muted-foreground">Suas informações e preferências</p>
          </div>
        </div>
      </header>

      <main className="px-5 space-y-6">
        {/* Profile info */}
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

        {/* Actions */}
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

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed px-4">
          Os conteúdos deste app são informativos e não substituem orientação médica profissional.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
