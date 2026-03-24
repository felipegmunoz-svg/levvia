import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { saveWithRetry } from "@/lib/saveWithRetry";
import Day5Welcome from "./Day5Welcome";
import Day5MovementGuide from "./Day5MovementGuide";
import Day5Snack from "./Day5Snack";
import Day5Journal from "./Day5Journal";
import Day5Closing from "./Day5Closing";

type Day5Step = "loading" | "welcome" | "movement" | "snack" | "journal" | "closing";

interface Day5FlowProps {
  onComplete: () => void;
}

const STEPS_ORDER: Day5Step[] = ["welcome", "movement", "snack", "journal", "closing"];

interface MovementData {
  exercisesCompleted?: Record<string, boolean>;
  journalEntry?: {
    legsSensation: string;
    energyLevel: string;
    notes?: string;
  };
}

const Day5Flow = ({ onComplete }: Day5FlowProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Day5Step>("loading");
  const [movementData, setMovementData] = useState<MovementData>({});

  useEffect(() => {
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
  }, []);

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
          <Day5MovementGuide onContinue={(data) => goTo("snack", { exercisesCompleted: data })} />
        </motion.div>
      )}
      {step === "snack" && (
        <motion.div key="snack" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5Snack onContinue={() => goTo("journal")} />
        </motion.div>
      )}
      {step === "journal" && (
        <motion.div key="journal" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5Journal onContinue={(data) => goTo("closing", { journalEntry: data })} />
        </motion.div>
      )}
      {step === "closing" && (
        <motion.div key="closing" {...stepVariants} transition={{ duration: 0.3 }}>
          <Day5Closing onComplete={handleDay5Complete} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Day5Flow;
