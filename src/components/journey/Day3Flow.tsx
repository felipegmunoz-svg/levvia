import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { saveWithRetry } from "@/lib/saveWithRetry";
import Day3Welcome from "./Day3Welcome";
import FoodTrafficLight from "./FoodTrafficLight";
import Day3CardapioPersonalizado from "./Day3CardapioPersonalizado";
import Day3Closing from "./Day3Closing";
import BottomNav from "@/components/BottomNav";
import logoFull from "@/assets/logo_livvia_azul.png";

type Day3Step = "loading" | "welcome" | "semaforo" | "cardapio" | "closing";

interface Day3FlowProps {
  onComplete: () => void;
  isReviewMode?: boolean;
}

const STEPS_ORDER: Day3Step[] = ["welcome", "semaforo", "cardapio", "closing"];

const Day3Flow = ({ onComplete, isReviewMode = false }: Day3FlowProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Day3Step>("loading");

  // Restore step from localStorage
  useEffect(() => {
    if (isReviewMode) return;
    const saved = localStorage.getItem("levvia_day3_progress");
    if (saved) {
      try {
        const { lastStep } = JSON.parse(saved);
        if (STEPS_ORDER.includes(lastStep)) {
          console.log("📂 Day3Flow — Retomando do passo:", lastStep);
          setStep(lastStep);
          return;
        }
      } catch {}
    }
    setStep("welcome");
  }, [isReviewMode]);

  const goTo = (nextStep: Day3Step) => {
    console.log(`🔄 Day3Flow — ${step} → ${nextStep}`);
    localStorage.setItem(
      "levvia_day3_progress",
      JSON.stringify({ lastStep: nextStep, timestamp: new Date().toISOString() })
    );
    setStep(nextStep);
  };

  const handleDay3Complete = async () => {
    if (!user?.id) return;

    console.log("💾 Day3Flow — Salvando conclusão do Dia 3...");

    try {
      const success = await saveWithRetry({
        userId: user.id,
        data: {
          day3_completed: true,
          day3_completed_at: new Date().toISOString(),
        },
        onRetry: () => handleDay3Complete(),
      });

      if (success) {
        console.log("✅ Dia 3 concluído com sucesso");
        localStorage.removeItem("levvia_day3_progress");
        onComplete();
      }
    } catch (err) {
      console.error("❌ Erro ao completar Dia 3:", err);
    }
  };

  // ===== REVIEW MODE =====
  if (isReviewMode) {
    return (
      <div className="levvia-page min-h-screen pb-24">
        <div className="p-4 border-b border-white/[0.08] bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex justify-center">
            <img src={logoFull} alt="Levvia" className="h-10" />
          </div>
        </div>

        <div className="p-5 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-3xl">🚦</span>
            <h1 className="text-xl font-heading font-bold text-levvia-fg">
              Dia 3: Semáforo Alimentar
            </h1>
            <p className="text-sm text-levvia-muted font-body">
              Revisão do seu terceiro dia de jornada
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🚦 Semáforo dos Alimentos</h2>
            <FoodTrafficLight onContinue={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🍽️ Cardápio Personalizado</h2>
            <Day3CardapioPersonalizado onContinue={() => {}} />
          </div>

          <button
            onClick={() => navigate('/journey')}
            className="w-full py-3 bg-levvia-primary text-white rounded-xl font-medium font-body"
          >
            ← Voltar para Jornada
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // ===== NORMAL MODE =====
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === "welcome") return <><Day3Welcome onNext={() => goTo("semaforo")} /><BottomNav /></>;
  if (step === "semaforo") return <><FoodTrafficLight onContinue={() => goTo("cardapio")} /><BottomNav /></>;
  if (step === "cardapio") return <><Day3CardapioPersonalizado onContinue={() => goTo("closing")} /><BottomNav /></>;
  if (step === "closing") return <><Day3Closing onComplete={handleDay3Complete} /><BottomNav /></>;

  return null;
};

export default Day3Flow;
