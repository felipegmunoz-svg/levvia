import { useState, useEffect, useMemo } from "react";
import { Dumbbell, UtensilsCrossed, Heart, X, Trophy, AlertTriangle, Sparkles, Info, Coffee, Sun, Sunset, BarChart3 } from "lucide-react";
import ProgressDashboard from "@/components/ProgressDashboard";
import ChecklistItemCard from "@/components/ChecklistItemCard";
import { challengeDays, getIncentiveMessage } from "@/data/challengeDays";
import type { ChallengeActivity } from "@/data/challengeDays";
import { exercises } from "@/data/exercises";
import { recipes } from "@/data/recipes";
import type { Exercise } from "@/data/exercises";
import type { Recipe } from "@/data/recipes";
import { getMealPlanForDay, mealSlots } from "@/data/mealPlan";
import type { MealSlot } from "@/data/mealPlan";
import ExerciseDetail from "@/components/ExerciseDetail";
import RecipeDetail from "@/components/RecipeDetail";
import BottomNav from "@/components/BottomNav";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";

const Today = () => {
  const [selectedExercise, setSelectedExercise] = useState<{ exercise: Exercise; activityId: string } | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<{ recipe: Recipe; activityId: string } | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // --- Onboarding data ---
  const { userName, painAnswer } = useMemo(() => {
    const saved = localStorage.getItem("levvia_onboarding");
    if (saved) {
      const data = JSON.parse(saved);
      return { userName: (data[2] as string) || "", painAnswer: (data[3] as string) || "" };
    }
    return { userName: "", painAnswer: "" };
  }, []);

  const isHighPain = painAnswer === "Dor intensa" || painAnswer === "Dor muito intensa";

  // --- Challenge day calculation ---
  const currentDay = useMemo(() => {
    let start = localStorage.getItem("levvia_challenge_start");
    if (!start) {
      start = new Date().toISOString();
      localStorage.setItem("levvia_challenge_start", start);
    }
    const diff = Date.now() - new Date(start).getTime();
    const day = Math.floor(diff / 86400000) + 1;
    return Math.min(Math.max(day, 1), 14);
  }, []);

  const todayData = challengeDays[currentDay - 1];

  // --- Meal plan for today ---
  const todayMeals = useMemo(() => getMealPlanForDay(currentDay), [currentDay]);

  // Build meal activities from meal plan
  const mealActivities: ChallengeActivity[] = useMemo(() => {
    return mealSlots
      .filter((slot) => todayMeals[slot] !== null)
      .map((slot) => ({
        id: `day${currentDay}-meal-${slot.replace(/\s/g, "")}`,
        type: "recipe" as const,
        label: `${slot}: ${todayMeals[slot]!.title}`,
        recipeId: todayMeals[slot]!.id,
      }));
  }, [currentDay, todayMeals]);

  // --- Progress state ---
  const [progress, setProgress] = useState<Record<string, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem("levvia_challenge_progress");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("levvia_challenge_progress", JSON.stringify(progress));
  }, [progress]);

  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  // --- All activities for today ---
  const allActivities: ChallengeActivity[] = useMemo(() => {
    const acts = [...todayData.exercises, ...mealActivities, ...todayData.habits];
    return acts;
  }, [todayData, mealActivities]);

  const dayProgress = progress[currentDay] || {};
  const completedCount = allActivities.filter((a) => dayProgress[a.id]).length;
  const totalCount = allActivities.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // --- Previous day feedback ---
  const prevDayFeedback = useMemo(() => {
    if (currentDay <= 1) return null;
    const prevDay = currentDay - 1;
    const prevData = challengeDays[prevDay - 1];
    const prevProgress = progress[prevDay] || {};
    const prevActivities = [...prevData.exercises, ...prevData.recipes, ...prevData.habits];
    const prevCompleted = prevActivities.filter((a) => prevProgress[a.id]).length;
    const allDone = prevCompleted === prevActivities.length;
    return { day: prevDay, allDone, completed: prevCompleted, total: prevActivities.length };
  }, [currentDay, progress]);

  // --- Handlers ---
  const handleToggle = (id: string) => {
    const activity = allActivities.find((a) => a.id === id);
    if (!activity) return;

    const isChecked = !!dayProgress[id];

    if (!isChecked) {
      if (activity.type === "habit" && activity.modalContent) {
        setModalContent({ title: activity.label, text: activity.modalContent });
      } else if (activity.type === "exercise" && activity.exerciseId) {
        const ex = exercises.find((e) => e.id === activity.exerciseId);
        if (ex) {
          setSelectedExercise({ exercise: ex, activityId: id });
          return;
        }
      } else if (activity.type === "recipe" && activity.recipeId) {
        const rec = recipes.find((r) => r.id === activity.recipeId);
        if (rec) {
          setSelectedRecipe({ recipe: rec, activityId: id });
          return;
        }
      }
    }

    setProgress((prev) => ({
      ...prev,
      [currentDay]: { ...prev[currentDay], [id]: !isChecked },
    }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia! ☀️";
    if (hour < 18) return "Boa tarde! 🌤️";
    return "Boa noite! 🌙";
  };

  const dailyPhrase = isHighPain && todayData.phraseHighPain ? todayData.phraseHighPain : todayData.phrase;

  const handleMarkExerciseDone = () => {
    if (selectedExercise) {
      setProgress((prev) => ({
        ...prev,
        [currentDay]: { ...prev[currentDay], [selectedExercise.activityId]: true },
      }));
      setSelectedExercise(null);
    }
  };

  const handleMarkRecipeDone = () => {
    if (selectedRecipe) {
      setProgress((prev) => ({
        ...prev,
        [currentDay]: { ...prev[currentDay], [selectedRecipe.activityId]: true },
      }));
      setSelectedRecipe(null);
    }
  };

  if (selectedExercise) {
    return (
      <ExerciseDetail
        exercise={selectedExercise.exercise}
        onBack={() => setSelectedExercise(null)}
        onMarkDone={handleMarkExerciseDone}
      />
    );
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe.recipe}
        onBack={() => setSelectedRecipe(null)}
        onMarkDone={handleMarkRecipeDone}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-page px-6 pt-10 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-1">
          <img src={logoIcon} alt="Levvia" className="w-8 h-auto" />
          <p className="text-muted-foreground text-sm font-medium">{getGreeting()}</p>
        </div>
        <h1 className="text-2xl font-light text-foreground mt-1">
          {userName ? `${userName}, seu dia de cuidado` : "Seu dia de cuidado"}
        </h1>

        {/* Day counter */}
        <div className="mt-3 inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm px-4 py-1.5 rounded-full">
          <Sparkles size={14} strokeWidth={1.5} className="text-secondary" />
          <span className="text-sm font-medium text-foreground">
            Dia {currentDay} de 14
          </span>
        </div>

        {/* Day title & objective */}
        <p className="text-xs text-foreground/80 mt-2 font-medium">
          {todayData.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {todayData.objective}
        </p>

        {/* Motivational phrase */}
        <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed">
          "{dailyPhrase}"
        </p>

        {/* Progress bar */}
        <div className="mt-5 glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progresso de hoje</span>
            <span className="text-sm font-medium text-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-success rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="text-xs text-foreground/90 font-medium mt-2 text-center">
              🎉 Parabéns! Você completou todas as atividades!
            </p>
          )}
        </div>
      </header>

      {/* Previous day feedback */}
      {prevDayFeedback && (
        <div className={`mx-5 mt-4 glass-card p-4 ${
          prevDayFeedback.allDone ? "border-success/30" : "border-accent/30"
        }`}>
          <div className="flex items-start gap-3">
            {prevDayFeedback.allDone ? (
              <Trophy size={20} strokeWidth={1.5} className="text-success flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={20} strokeWidth={1.5} className="text-accent flex-shrink-0 mt-0.5" />
            )}
            <div>
              {prevDayFeedback.allDone ? (
                <p className="text-sm text-foreground">
                  <span className="font-medium">Parabéns!</span> Você concluiu todas as atividades do Dia {prevDayFeedback.day}! Continue assim! 🎉
                </p>
              ) : (
                <p className="text-sm text-foreground">
                  <span className="font-medium">Atenção!</span> Você deixou {prevDayFeedback.total - prevDayFeedback.completed} atividades pendentes no Dia {prevDayFeedback.day}. Seu comprometimento é a chave para o sucesso!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Incentive message */}
      <div className="mx-5 mt-4">
        <p className="text-xs text-muted-foreground italic text-center leading-relaxed">
          💡 {getIncentiveMessage(progressPercent)}
        </p>
      </div>

      {/* Dashboard toggle */}
      <div className="mx-5 mt-3 flex justify-center">
        <button
          onClick={() => setShowDashboard(!showDashboard)}
          className={`flex items-center gap-2 text-xs px-4 py-2 rounded-full font-medium transition-all ${
            showDashboard
              ? "bg-secondary/20 text-secondary"
              : "bg-white/[0.06] text-muted-foreground border border-white/10 hover:border-secondary/30"
          }`}
        >
          <BarChart3 size={14} strokeWidth={1.5} />
          {showDashboard ? "Ocultar progresso" : "Ver meu progresso"}
        </button>
      </div>

      {/* Progress dashboard */}
      {showDashboard && (
        <ProgressDashboard currentDay={currentDay} progress={progress} />
      )}

      {/* Daily activities */}
      <main className="px-5 mt-6 space-y-6">
        {/* Exercises */}
        {todayData.exercises.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell size={18} strokeWidth={1.5} className="text-secondary" />
              <h2 className="text-base font-medium text-foreground">Exercícios</h2>
            </div>
            <div className="space-y-2">
              {todayData.exercises.map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={!!dayProgress[item.id]}
                  onToggle={handleToggle}
                  hasAction={true}
                  actionType="exercise"
                />
              ))}
            </div>
          </section>
        )}

        {/* Cardápio do Dia */}
        {mealActivities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed size={18} strokeWidth={1.5} className="text-secondary" />
              <h2 className="text-base font-medium text-foreground">Cardápio do Dia</h2>
            </div>
            <div className="space-y-2">
              {mealActivities.map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={!!dayProgress[item.id]}
                  onToggle={handleToggle}
                  hasAction={true}
                  actionType="recipe"
                />
              ))}
            </div>
          </section>
        )}

        {/* Habits */}
        {todayData.habits.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Heart size={18} strokeWidth={1.5} className="text-secondary" />
              <h2 className="text-base font-medium text-foreground">Hábitos do Dia</h2>
            </div>
            <div className="space-y-2">
              {todayData.habits.map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={!!dayProgress[item.id]}
                  onToggle={handleToggle}
                  hasAction={!!item.modalContent}
                  actionType="modal"
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="glass-card p-6 max-w-sm w-full relative">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
            <h3 className="text-base font-medium text-foreground mb-3">{modalContent.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{modalContent.text}</p>
            <button
              onClick={() => setModalContent(null)}
              className="mt-5 w-full py-3 rounded-3xl gradient-primary text-foreground font-medium text-sm"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Today;
