import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { saveWithRetry } from "@/lib/saveWithRetry";
import Day5Welcome from "./Day5Welcome";
import Day5MovementGuide from "./Day5MovementGuide";
import Day5Lunch from "./Day5Lunch";
import Day5Snack from "./Day5Snack";
import Day5MicroChallenge from "./Day5MicroChallenge";
import Day5LegsElevation from "./Day5LegsElevation";
import Day5Journal from "./Day5Journal";
import Day5Closing from "./Day5Closing";
import Day5Dashboard from "./Day5Dashboard";
import BottomNav from "@/components/BottomNav";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";

type Day5Step = "loading" | "welcome" | "movement" | "lunch" | "snack" | "microChallenge" | "legsElevation" | "journal" | "closing" | "dashboard";

interface Day5FlowProps {
  onComplete: () => void;
  isReviewMode?: boolean;
}

const STEPS_ORDER: Day5Step[] = ["welcome", "movement", "lunch", "snack", "microChallenge", "legsElevation", "journal", "closing", "dashboard"];

interface MovementData {
  exercisesCompleted?: Record<string, boolean>;
  lunchChoice?: string;
  snackChoice?: string;
  microChallengeCompleted?: boolean;
  legsElevationDuration?: number;
  journalEntry?: {
    legsSensation: string;
    energyLevel: string;
    notes?: string;
  };
}

const Day5Flow = ({ onComplete, isReviewMode = false }: Day5FlowProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState<Day5Step>("loading");
  const [movementData, setMovementData] = useState<MovementData>({});

  useEffect(() => {
    if (isReviewMode) return;
    const saved = localStorage.getItem("levvia_day5_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (STEPS_ORDER.includes(parsed.lastStep)) {
          if (parsed.movementData) setMovementData(parsed.movementData);
          setStep(parsed.lastStep);
          return;
        }
      } catch {}
    }
    setStep("welcome");
  }, [isReviewMode]);

  const goTo = (nextStep: Day5Step, newData?: Partial<MovementData>) => {
    const merged = newData ? { ...movementData, ...newData } : movementData;
    if (newData) setMovementData(merged);
    localStorage.setItem(
      "levvia_day5_progress",
      JSON.stringify({ lastStep: nextStep, movementData: merged, timestamp: new Date().toISOString() })
    );
    setStep(nextStep);
  };

  const handleDay5Complete = async () => {
    if (!user?.id) return;

    try {
      const success = await saveWithRetry({
        userId: user.id,
        data: {
          day5_completed: true,
          day5_completed_at: new Date().toISOString(),
          day5_movement_data: { ...movementData, createdAt: new Date().toISOString() },
        },
        onRetry: () => handleDay5Complete(),
      });

      if (success) {
        localStorage.removeItem("levvia_day5_progress");
        onComplete();
      }
    } catch (err) {
      console.error("❌ Erro ao completar Dia 5:", err);
    }
  };

  // ===== REVIEW MODE =====
  if (isReviewMode) {
    return (
      <div className="levvia-page min-h-screen pb-24">
        <div className="p-4 border-b border-levvia-border bg-white sticky top-0 z-10">
          <img src={logoIcon} alt="Levvia" className="h-7" />
        </div>

        <div className="p-5 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-3xl">🏃‍♀️</span>
            <h1 className="text-xl font-heading font-bold text-levvia-fg">
              Dia 5: Movimento Sem Dor
            </h1>
            <p className="text-sm text-levvia-muted font-body">
              Revisão do seu quinto dia de jornada
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🤸‍♀️ Guia de Movimento</h2>
            <Day5MovementGuide onContinue={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🍽️ Almoço</h2>
            <Day5Lunch onContinue={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🍎 Lanche</h2>
            <Day5Snack onContinue={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🏃‍♀️ Micro-Desafio</h2>
            <Day5MicroChallenge onContinue={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🦵 Elevação de Pernas</h2>
            <Day5LegsElevation onContinue={() => {}} />
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
          <Day5Welcome onContinue={() => goTo("movement")} />
        </motion.div>
      )}
      {step === "movement" && (
        <motion.div key="movement" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5MovementGuide onContinue={(data) => goTo("lunch", { exercisesCompleted: data })} />
        </motion.div>
      )}
      {step === "lunch" && (
        <motion.div key="lunch" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5Lunch onContinue={(choice) => goTo("snack", { lunchChoice: choice })} />
        </motion.div>
      )}
      {step === "snack" && (
        <motion.div key="snack" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5Snack onContinue={() => goTo("microChallenge")} />
        </motion.div>
      )}
      {step === "microChallenge" && (
        <motion.div key="microChallenge" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5MicroChallenge onContinue={() => goTo("legsElevation", { microChallengeCompleted: true })} />
        </motion.div>
      )}
      {step === "legsElevation" && (
        <motion.div key="legsElevation" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5LegsElevation onContinue={(duration) => goTo("journal", { legsElevationDuration: duration })} />
        </motion.div>
      )}
      {step === "journal" && (
        <motion.div key="journal" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5Journal onContinue={(data) => goTo("closing", { journalEntry: data })} />
        </motion.div>
      )}
      {step === "closing" && (
        <motion.div key="closing" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5Closing onComplete={() => goTo("dashboard")} />
        </motion.div>
      )}
      {step === "dashboard" && (
        <motion.div key="dashboard" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5Dashboard movementData={movementData} heatMapDay1={profile.heatMapDay1} onContinue={handleDay5Complete} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Day5Flow;
