import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import ExerciseDetail from "@/components/ExerciseDetail";
import { useChallengeData } from "@/hooks/useChallengeData";
import { selectExercisesForDay, type DbExercise } from "@/lib/profileEngine";

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
    benefits: ex.benefits || "",
    safety: ex.safety || undefined,
    variations: ex.variations || undefined,
    icon: ex.icon || "dumbbell",
  };
}

const HistoryExercises = () => {
  const navigate = useNavigate();
  const { currentDay, allExercises, profile } = useChallengeData();
  const [selectedExercise, setSelectedExercise] = useState<DbExercise | null>(null);

  const unlockedExercises = useMemo(() => {
    const seen = new Set<string>();
    const items: { exercise: DbExercise; day: number }[] = [];

    for (let day = 1; day <= currentDay; day++) {
      const dayExercises = selectExercisesForDay(allExercises, profile, day, 2);
      for (const ex of dayExercises) {
        if (!seen.has(ex.id)) {
          seen.add(ex.id);
          items.push({ exercise: ex, day });
        }
      }
    }

    return items;
  }, [currentDay, allExercises, profile]);

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
      <header className="gradient-page px-6 pt-10 pb-6 rounded-b-3xl">
        <button onClick={() => navigate("/history")} className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Voltar
        </button>
        <h1 className="text-2xl font-light text-foreground">🌊 Exercícios</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {unlockedExercises.length} práticas desbloqueadas
        </p>
      </header>

      <main className="px-5 mt-6 space-y-3">
        {unlockedExercises.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ainda não há exercícios desbloqueados. Complete os dias da sua jornada para construir seu histórico.
            </p>
          </div>
        ) : (
          unlockedExercises.map(({ exercise, day }, i) => (
            <motion.button
              key={exercise.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedExercise(exercise)}
              className="glass-card p-4 w-full text-left flex items-center gap-3 transition-all hover:border-secondary/30 active:scale-[0.98]"
            >
              <span className="text-2xl">🌊</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{exercise.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Dia {day} da jornada • {exercise.category}</p>
              </div>
            </motion.button>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default HistoryExercises;
