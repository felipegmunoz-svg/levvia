import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { saveWithRetry } from "@/lib/saveWithRetry";
import Day4Welcome from "./Day4Welcome";
import Day4SleepHygiene from "./Day4SleepHygiene";
import BreathingCircle from "./BreathingCircle";
import Day4CardapioNoturno from "./Day4CardapioNoturno";
import Day4Closing from "./Day4Closing";
import BottomNav from "@/components/BottomNav";
import logoFull from "@/assets/logo_livvia_azul.png";

type Day4Step = "loading" | "welcome" | "hygiene" | "breathing" | "cardapio" | "closing";

interface Day4FlowProps {
  onComplete: () => void;
  isReviewMode?: boolean;
}

const STEPS_ORDER: Day4Step[] = ["welcome", "hygiene", "breathing", "cardapio", "closing"];

interface SleepData {
  hygieneChecklist?: Record<string, boolean>;
  breathingCompleted?: boolean;
}

const Day4Flow = ({ onComplete, isReviewMode = false }: Day4FlowProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Day4Step>("loading");
  const [sleepData, setSleepData] = useState<SleepData>({});

  useEffect(() => {
    if (isReviewMode) return;
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
  }, [isReviewMode]);

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

  // ===== REVIEW MODE =====
  if (isReviewMode) {
    return (
      <div className="levvia-page min-h-screen pb-24">
        <div className="p-4 border-b border-levvia-border bg-white sticky top-0 z-10">
          <div className="flex justify-center">
            <img src={logoFull} alt="Levvia" className="h-10" />
          </div>
        </div>

        <div className="p-5 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-3xl">😴</span>
            <h1 className="text-xl font-heading font-bold text-levvia-fg">
              Dia 4: Sono & Recuperação
            </h1>
            <p className="text-sm text-levvia-muted font-body">
              Revisão do seu quarto dia de jornada
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🛏️ Higiene do Sono</h2>
            <Day4SleepHygiene onContinue={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🫁 Respiração Guiada</h2>
            <BreathingCircle onContinue={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🍽️ Cardápio Noturno</h2>
            <Day4CardapioNoturno onContinue={() => {}} />
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

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AnimatePresence mode="wait">
      {step === "welcome" && (
        <motion.div key="welcome" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day4Welcome onContinue={() => goTo("hygiene")} />
        </motion.div>
      )}
      {step === "hygiene" && (
        <motion.div key="hygiene" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day4SleepHygiene onContinue={(data) => goTo("breathing", { hygieneChecklist: data })} />
        </motion.div>
      )}
      {step === "breathing" && (
        <motion.div key="breathing" {...stepVariants} transition={{ duration: 0.3 }}>
          <BreathingCircle onContinue={() => goTo("cardapio", { breathingCompleted: true })} />
        </motion.div>
      )}
      {step === "cardapio" && (
        <motion.div key="cardapio" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day4CardapioNoturno onContinue={() => goTo("closing")} />
        </motion.div>
      )}
      {step === "closing" && (
        <motion.div key="closing" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day4Closing onComplete={handleDay4Complete} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Day4Flow;
