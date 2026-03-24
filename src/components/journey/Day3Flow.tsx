import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { saveWithRetry } from "@/lib/saveWithRetry";
import Day3Welcome from "./Day3Welcome";
import FoodTrafficLight from "./FoodTrafficLight";
import Day3CardapioPersonalizado from "./Day3CardapioPersonalizado";
import Day3Closing from "./Day3Closing";

type Day3Step = "loading" | "welcome" | "semaforo" | "cardapio" | "closing";

interface Day3FlowProps {
  onComplete: () => void;
}

const STEPS_ORDER: Day3Step[] = ["welcome", "semaforo", "cardapio", "closing"];

const Day3Flow = ({ onComplete }: Day3FlowProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Day3Step>("loading");

  // Restore step from localStorage
  useEffect(() => {
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
  }, []);

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

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === "welcome") return <Day3Welcome onNext={() => goTo("semaforo")} />;
  if (step === "semaforo") return <FoodTrafficLight onContinue={() => goTo("cardapio")} />;
  if (step === "cardapio") return <Day3CardapioPersonalizado onContinue={() => goTo("closing")} />;
  if (step === "closing") return <Day3Closing onComplete={handleDay3Complete} />;

  return null;
};

export default Day3Flow;
