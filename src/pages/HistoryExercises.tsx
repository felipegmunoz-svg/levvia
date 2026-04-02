import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import ExerciseDetail from "@/components/ExerciseDetail";
import { useChallengeData } from "@/hooks/useChallengeData";
import type { DbExercise } from "@/lib/profileEngine";

function toExerciseView(ex: DbExercise) {
  return {
    id: 0,
    title: ex.title,
    category: ex.category,
    level: ex.level,
    duration: ex.duration,
    frequency: ex.frequency || "",
    description: ex.description,
    startPosition: ex.start_position || "",
    steps: ex.steps || [],
    benefits: ex.benefits || ex.clinical_benefit || "",
    safety: ex.safety || undefined,
    variations: ex.variations || undefined,
    icon: ex.icon || "dumbbell",
  };
}

const HistoryExercises = () => {
  const navigate = useNavigate();
  const { currentDay, allExercises, challengeProgress } = useChallengeData();
  const [selectedExercise, setSelectedExercise] = useState<DbExercise | null>(null);

  const servedExercises = useMemo(() => {
    const items: { exercise: DbExercise; day: number }[] = [];
    const seen = new Set<string>();

    for (let day = currentDay; day >= 1; day--) {
      const dayTp = (challengeProgress as any)?.touchpoints?.[`day${day}`];
      if (!dayTp) continue;

      // Read exercise from morning and afternoon slots (backward compat: top-level and .diary)
      const slotsToCheck = [dayTp.morning, dayTp.afternoon].filter(Boolean);
      for (const slot of slotsToCheck) {
        if (!slot?.done) continue;
        const exerciseId =
          slot.exercise_id ??
          slot.micro_challenge_id ??
          (slot.diary as any)?.exercise_id ??
          (slot.diary as any)?.micro_challenge_id;

        if (!exerciseId || seen.has(exerciseId)) continue;
        seen.add(exerciseId);

        const exercise = allExercises.find((e) => e.id === exerciseId);
        if (exercise) {
          items.push({ exercise, day });
        }
      }
    }

    return items;
  }, [currentDay, challengeProgress, allExercises]);

  if (selectedExercise) {
    return (
      <ExerciseDetail
        exercise={toExerciseView(selectedExercise)}
        onBack={() => setSelectedExercise(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-6">
        <button onClick={() => navigate("/history")} className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <h1 className="text-xl font-heading font-bold text-foreground">💪 Exercícios que fiz</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {servedExercises.length} exercício{servedExercises.length !== 1 ? "s" : ""} realizado{servedExercises.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {servedExercises.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              Os exercícios que você realizar aparecerão aqui, com o dia da jornada em que foram feitos.
            </p>
          </div>
        ) : (
          servedExercises.map(({ exercise, day }, i) => (
            <motion.button
              key={`${exercise.id}-${day}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedExercise(exercise)}
              className="glass-card p-4 w-full text-left flex items-center gap-3 transition-all hover:border-secondary/30 active:scale-[0.98]"
            >
              <span className="text-2xl">💪</span>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-foreground text-sm truncate">{exercise.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Dia {day} da jornada</p>
              </div>
              <span className="text-xs text-muted-foreground">Ver →</span>
            </motion.button>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default HistoryExercises;
