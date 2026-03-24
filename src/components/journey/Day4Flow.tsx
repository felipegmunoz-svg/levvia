import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { saveWithRetry } from "@/lib/saveWithRetry";
import Day4Welcome from "./Day4Welcome";
import Day4SleepHygiene from "./Day4SleepHygiene";
import BreathingCircle from "./BreathingCircle";
import Day4CardapioNoturno from "./Day4CardapioNoturno";
import Day4Closing from "./Day4Closing";

type Day4Step = "loading" | "welcome" | "hygiene" | "breathing" | "cardapio" | "closing";

interface Day4FlowProps {
  onComplete: () => void;
}

const STEPS_ORDER: Day4Step[] = ["welcome", "hygiene", "breathing", "cardapio", "closing"];

interface SleepData {
  hygieneChecklist?: Record<string, boolean>;
  breathingCompleted?: boolean;
}

const Day4Flow = ({ onComplete }: Day4FlowProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Day4Step>("loading");
  const [sleepData, setSleepData] = useState<SleepData>({});

  useEffect(() => {
    const saved = localStorage.getItem("levvia_day4_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (STEPS_ORDER.includes(parsed.lastStep)) {
          console.log("📂 Day4Flow — Retomando do passo:", parsed.lastStep);
          if (parsed.sleepData) setSleepData(parsed.sleepData);
          setStep(parsed.lastStep);
          return;
        }
      } catch {}
    }
    setStep("welcome");
  }, []);

  const goTo = (nextStep: Day4Step, newSleepData?: Partial<SleepData>) => {
    console.log(`🔄 Day4Flow — ${step} → ${nextStep}`);
    const merged = newSleepData ? { ...sleepData, ...newSleepData } : sleepData;
    if (newSleepData) setSleepData(merged);
    localStorage.setItem(
      "levvia_day4_progress",
      JSON.stringify({ lastStep: nextStep, sleepData: merged, timestamp: new Date().toISOString() })
    );
    setStep(nextStep);
  };

  const handleDay4Complete = async () => {
    if (!user?.id) return;

    console.log("💾 Day4Flow — Salvando conclusão do Dia 4...");

    try {
      const success = await saveWithRetry({
        userId: user.id,
        data: {
          day4_completed: true,
          day4_completed_at: new Date().toISOString(),
          day4_sleep_data: { ...sleepData, createdAt: new Date().toISOString() },
        },
        onRetry: () => handleDay4Complete(),
      });

      if (success) {
        console.log("✅ Dia 4 concluído com sucesso");
        localStorage.removeItem("levvia_day4_progress");
        onComplete();
      }
    } catch (err) {
      console.error("❌ Erro ao completar Dia 4:", err);
    }
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === "welcome") return <Day4Welcome onContinue={() => goTo("hygiene")} />;
  if (step === "hygiene") return <Day4SleepHygiene onContinue={(data) => goTo("breathing", { hygieneChecklist: data })} />;
  if (step === "breathing") return <BreathingCircle onContinue={() => goTo("cardapio", { breathingCompleted: true })} />;
  if (step === "cardapio") return <Day4CardapioNoturno onContinue={() => goTo("closing")} />;
  if (step === "closing") return <Day4Closing onComplete={handleDay4Complete} />;

  return null;
};

export default Day4Flow;
