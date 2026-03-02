import { useState, useEffect, useMemo } from "react";
import { Dumbbell, UtensilsCrossed, Heart, X, Trophy, AlertTriangle, Sparkles, Info } from "lucide-react";
import ChecklistItemCard from "@/components/ChecklistItemCard";
import { challengeDays, getIncentiveMessage } from "@/data/challengeDays";
import type { ChallengeActivity } from "@/data/challengeDays";
import { exercises } from "@/data/exercises";
import { recipes } from "@/data/recipes";
import type { Exercise } from "@/data/exercises";
import type { Recipe } from "@/data/recipes";
import ExerciseDetail from "@/components/ExerciseDetail";
import RecipeDetail from "@/components/RecipeDetail";
import BottomNav from "@/components/BottomNav";

const Today = () => {
  const navigate = useNavigate();

  // --- Onboarding data ---
  const { userName, painAnswer } = useMemo(() => {
    const saved = localStorage.getItem("lipevida_onboarding");
    if (saved) {
      const data = JSON.parse(saved);
      return { userName: (data[2] as string) || "", painAnswer: (data[3] as string) || "" };
    }
    return { userName: "", painAnswer: "" };
  }, []);

  const isHighPain = painAnswer === "Dor intensa" || painAnswer === "Dor muito intensa";

  // --- Challenge day calculation ---
  const currentDay = useMemo(() => {
    let start = localStorage.getItem("lipevida_challenge_start");
    if (!start) {
      start = new Date().toISOString();
      localStorage.setItem("lipevida_challenge_start", start);
    }
    const diff = Date.now() - new Date(start).getTime();
    const day = Math.floor(diff / 86400000) + 1;
    return Math.min(Math.max(day, 1), 14);
  }, []);

  const todayData = challengeDays[currentDay - 1];

  // --- Progress state ---
  const [progress, setProgress] = useState<Record<string, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem("lipevida_challenge_progress");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("lipevida_challenge_progress", JSON.stringify(progress));
  }, [progress]);

  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  // --- All activities for today ---
  const allActivities: ChallengeActivity[] = useMemo(() => {
    const acts = [...todayData.exercises, ...todayData.recipes, ...todayData.habits];
    // For high-pain users in first 5 days, prioritize breathing/drainage exercises first (already ordered in data)
    return acts;
  }, [todayData]);

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
      // Trigger action when checking
      if (activity.type === "habit" && activity.modalContent) {
        setModalContent({ title: activity.label, text: activity.modalContent });
      } else if (activity.type === "exercise" && activity.exerciseId) {
        setProgress((prev) => ({
          ...prev,
          [currentDay]: { ...prev[currentDay], [id]: true },
        }));
        navigate(`/practices?tab=exercises&highlight=${activity.exerciseId}`);
        return;
      } else if (activity.type === "recipe" && activity.recipeId) {
        setProgress((prev) => ({
          ...prev,
          [currentDay]: { ...prev[currentDay], [id]: true },
        }));
        navigate(`/practices?tab=recipes&highlight=${activity.recipeId}`);
        return;
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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-primary px-6 pt-10 pb-8 rounded-b-3xl">
        <p className="text-primary-foreground/80 text-sm font-semibold">{getGreeting()}</p>
        <h1 className="text-2xl font-extrabold text-primary-foreground mt-1">
          {userName ? `${userName}, seu dia de cuidado` : "Seu dia de cuidado"}
        </h1>

        {/* Day counter */}
        <div className="mt-3 inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
          <Sparkles size={14} className="text-primary-foreground" />
          <span className="text-sm font-extrabold text-primary-foreground">
            Dia {currentDay} de 14
          </span>
        </div>

        {/* Day title & objective */}
        <p className="text-xs text-primary-foreground/80 mt-2 font-bold">
          {todayData.title}
        </p>
        <p className="text-xs text-primary-foreground/60 mt-0.5">
          {todayData.objective}
        </p>

        {/* Motivational phrase */}
        <p className="text-xs text-primary-foreground/70 mt-2 italic leading-relaxed">
          "{dailyPhrase}"
        </p>

        {/* Progress bar */}
        <div className="mt-5 bg-card/15 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-primary-foreground">Progresso de hoje</span>
            <span className="text-sm font-extrabold text-primary-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="w-full h-2.5 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="text-xs text-primary-foreground/90 font-semibold mt-2 text-center">
              🎉 Parabéns! Você completou todas as atividades!
            </p>
          )}
        </div>
      </header>

      {/* Previous day feedback */}
      {prevDayFeedback && (
        <div className={`mx-5 mt-4 rounded-2xl p-4 ${
          prevDayFeedback.allDone
            ? "bg-primary-light"
            : "bg-accent/10"
        }`}>
          <div className="flex items-start gap-3">
            {prevDayFeedback.allDone ? (
              <Trophy size={20} className="text-primary flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={20} className="text-accent-foreground flex-shrink-0 mt-0.5" />
            )}
            <div>
              {prevDayFeedback.allDone ? (
                <p className="text-sm text-foreground">
                  <span className="font-bold">Parabéns!</span> Você concluiu todas as atividades do Dia {prevDayFeedback.day}! Continue assim! 🎉
                </p>
              ) : (
                <p className="text-sm text-foreground">
                  <span className="font-bold">Atenção!</span> Você deixou {prevDayFeedback.total - prevDayFeedback.completed} atividades pendentes no Dia {prevDayFeedback.day}. Seu comprometimento é a chave para o sucesso!
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

      {/* Daily activities */}
      <main className="px-5 mt-6 space-y-6">
        {/* Exercises */}
        {todayData.exercises.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell size={18} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">Exercícios</h2>
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

        {/* Recipes */}
        {todayData.recipes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed size={18} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">Receitas Sugeridas</h2>
            </div>
            <div className="space-y-2">
              {todayData.recipes.map((item) => (
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
              <Heart size={18} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">Hábitos do Dia</h2>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-6">
          <div className="bg-card rounded-2xl shadow-soft p-6 max-w-sm w-full relative">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h3 className="text-base font-bold text-foreground mb-3">{modalContent.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{modalContent.text}</p>
            <button
              onClick={() => setModalContent(null)}
              className="mt-5 w-full py-3 rounded-xl gradient-primary text-primary-foreground font-bold text-sm"
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
