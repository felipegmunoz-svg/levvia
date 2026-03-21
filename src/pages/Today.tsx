import { useState, useMemo, useEffect } from "react";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import { Dumbbell, UtensilsCrossed, Heart, X, Sparkles, BarChart3 } from "lucide-react";
import InstallPWAPrompt from "@/components/InstallPWAPrompt";
import ProgressDashboard from "@/components/ProgressDashboard";
import ChecklistItemCard from "@/components/ChecklistItemCard";
import ExerciseDetail from "@/components/ExerciseDetail";
import RecipeDetail from "@/components/RecipeDetail";
import BottomNav from "@/components/BottomNav";
import SymptomDiary from "@/components/SymptomDiary";
import MotorAlivio from "@/components/MotorAlivio";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";
import HeatMapCard from "@/components/HeatMapCard";
import FoodTrafficLightCard from "@/components/FoodTrafficLightCard";
import Day1Flow from "@/components/journey/Day1Flow";
import Day2Flow from "@/components/journey/Day2Flow";
import WaitingScreen from "@/components/journey/WaitingScreen";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useChallengeData, type ChallengeActivity } from "@/hooks/useChallengeData";
import type { DbExercise, DbRecipe } from "@/lib/profileEngine";

// Adapt DbExercise to the Exercise interface expected by ExerciseDetail
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

// Adapt DbRecipe to the Recipe interface expected by RecipeDetail
function toRecipeView(rec: DbRecipe) {
  return {
    id: 0,
    title: rec.title,
    tipo_refeicao: rec.tipo_refeicao || [],
    tags: rec.tags || [],
    ingredients: rec.ingredients || [],
    instructions: rec.instructions || [],
    por_que_resfria: rec.por_que_resfria || "",
    dica: rec.dica || "",
    category: rec.category,
    time: rec.time || "",
    servings: rec.servings || "",
    description: rec.description || "",
    icon: rec.icon || "utensils",
  };
}

function getIncentiveMessage(progress: number): string {
  if (progress === 0) return "";
  if (progress < 30) return "Você já começou, isso é o mais importante! Continue!";
  if (progress < 60) return "Bom progresso! Cada atividade concluída faz diferença.";
  if (progress < 100) return "Quase lá! Falta pouco para completar o dia!";
  return "🎉 Incrível! Você completou todas as atividades de hoje!";
}

const Today = () => {
  const { user } = useAuth();
  const {
    profile,
    currentDay,
    todayData,
    dayTitle,
    dayObjective,
    loading,
    challengeProgress,
    saveProgress,
  } = useChallengeData();

  const [day1Done, setDay1Done] = useState<boolean | null>(null);
  const [day2Done, setDay2Done] = useState<boolean | null>(null);
  const [day1CompletedAt, setDay1CompletedAt] = useState<string | null>(null);

  const isDev = import.meta.env.MODE === 'development';

  // Check day1_completed, day2_completed and timestamps from profile on mount
  useEffect(() => {
    if (!user?.id) {
      setDay1Done(true);
      setDay2Done(true);
      return;
    }
    supabase
      .from("profiles")
      .select("day1_completed, day1_completed_at, day2_completed, day2_completed_at")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setDay1Done((data as any)?.day1_completed === true);
        setDay2Done((data as any)?.day2_completed === true);
        setDay1CompletedAt((data as any)?.day1_completed_at || null);
      });
  }, [user?.id]);

  const [selectedExercise, setSelectedExercise] = useState<{ exercise: DbExercise; activityId: string } | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<{ recipe: DbRecipe; activityId: string } | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  // PWA install gate — show once per session if not installed
  const [showInstallGate, setShowInstallGate] = useState(() => {
    if (typeof window === "undefined") return false;
    // Don't show if already in standalone mode (installed)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return false;
    // Don't show if already dismissed
    if (sessionStorage.getItem("levvia_install_shown")) return false;
    return true;
  });

  const handleDismissInstall = () => {
    sessionStorage.setItem("levvia_install_shown", "1");
    setShowInstallGate(false);
  };

  // --- All activities for today ---
  const allActivities: ChallengeActivity[] = useMemo(() => {
    if (!todayData) return [];
    return [...todayData.exercises, ...todayData.meals, ...todayData.habits];
  }, [todayData]);

  const dayProgress = challengeProgress[currentDay] || {};
  const completedCount = allActivities.filter((a) => dayProgress[a.id]).length;
  const totalCount = allActivities.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // --- Handlers ---
  const handleToggle = (id: string) => {
    const activity = allActivities.find((a) => a.id === id);
    if (!activity) return;

    const isChecked = !!dayProgress[id];
    console.log(`🔄 Toggle: ${id} → ${isChecked ? "desmarcar" : "marcar"} (tipo: ${activity.type})`);

    if (!isChecked) {
      if (activity.type === "habit" && activity.modalContent) {
        setModalContent({ title: activity.label, text: activity.modalContent });
      } else if (activity.type === "exercise" && activity.exercise) {
        setSelectedExercise({ exercise: activity.exercise, activityId: id });
        return;
      } else if (activity.type === "recipe" && activity.recipe) {
        setSelectedRecipe({ recipe: activity.recipe, activityId: id });
        return;
      }
    }

    const newProgress = {
      ...challengeProgress,
      [currentDay]: { ...challengeProgress[currentDay], [id]: !isChecked },
    };
    saveProgress(newProgress);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia! ☀️";
    if (hour < 18) return "Boa tarde! 🌤️";
    return "Boa noite! 🌙";
  };

  const handleMarkExerciseDone = () => {
    if (selectedExercise) {
      const newProgress = {
        ...challengeProgress,
        [currentDay]: { ...challengeProgress[currentDay], [selectedExercise.activityId]: true },
      };
      saveProgress(newProgress);
      setSelectedExercise(null);
    }
  };

  const handleMarkRecipeDone = () => {
    if (selectedRecipe) {
      const newProgress = {
        ...challengeProgress,
        [currentDay]: { ...challengeProgress[currentDay], [selectedRecipe.activityId]: true },
      };
      saveProgress(newProgress);
      setSelectedRecipe(null);
    }
  };

  // Day 1 journey flow
  if (day1Done === null || day2Done === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (day1Done === false) {
    return <Day1Flow onComplete={() => setDay1Done(true)} />;
  }

  if (day2Done === false && currentDay >= 2) {
    // Check 24h gate (bypass in dev mode)
    if (!isDev && day1CompletedAt) {
      const hoursSince = (Date.now() - new Date(day1CompletedAt).getTime()) / 3600000;
      if (hoursSince < 24) {
        return (
          <WaitingScreen
            completedAt={day1CompletedAt}
            nextDay={2}
            onReady={() => setDay1CompletedAt(new Date(Date.now() - 25 * 3600000).toISOString())}
          />
        );
      }
    }
    return <Day2Flow onComplete={() => setDay2Done(true)} />;
  }

  // Show PWA install gate before everything else
  if (showInstallGate) {
    return <InstallPWAPrompt onDismiss={handleDismissInstall} />;
  }

  if (selectedExercise) {
    return (
      <ExerciseDetail
        exercise={toExerciseView(selectedExercise.exercise)}
        onBack={() => setSelectedExercise(null)}
        onMarkDone={handleMarkExerciseDone}
      />
    );
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={toRecipeView(selectedRecipe.recipe)}
        onBack={() => setSelectedRecipe(null)}
        onMarkDone={handleMarkRecipeDone}
      />
    );
  }

  if (loading || !todayData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Personalizando seu plano...</p>
        </div>
      </div>
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
          {profile.name ? `${profile.name}, seu dia de cuidado` : "Seu dia de cuidado"}
        </h1>

        {/* Day counter */}
        <div className="mt-3 inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm px-4 py-1.5 rounded-full">
          <Sparkles size={14} strokeWidth={1.5} className="text-secondary" />
          <span className="text-sm font-medium text-foreground">
            Dia {currentDay} de 14
          </span>
        </div>

        {/* Day title & objective */}
        <p className="text-xs text-foreground/80 mt-2 font-medium">{dayTitle}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{dayObjective}</p>

        {/* Motivational phrase */}
        <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed">
          "{todayData.phrase}"
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

        {/* Push notification prompt */}
        <div className="mt-4">
          <PushNotificationPrompt />
        </div>
      </header>

      {/* Quick Reference Cards */}
      <div className="mx-5 mt-4 grid grid-cols-2 gap-3">
        <HeatMapCard profile={profile} />
        <FoodTrafficLightCard profile={profile} />
      </div>

      {/* Pain relief mode */}
      <div className="mx-5 mt-4">
        <MotorAlivio
          onSelectExercise={(ex) => setSelectedExercise({ exercise: ex, activityId: `relief-${ex.id}` })}
        />
      </div>

      {/* Symptom diary */}
      <SymptomDiary />

      {/* Incentive message */}
      {getIncentiveMessage(progressPercent) && (
        <div className="mx-5 mt-4">
          <p className="text-xs text-muted-foreground italic text-center leading-relaxed">
            💡 {getIncentiveMessage(progressPercent)}
          </p>
        </div>
      )}

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
        <ProgressDashboard currentDay={currentDay} progress={challengeProgress} />
      )}

      {/* Daily activities */}
      <main className="px-5 mt-6 space-y-6">
        {/* Exercises */}
        {todayData.exercises.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell size={18} strokeWidth={1.5} className="text-secondary" />
              <h2 className="text-base font-medium text-foreground">Exercícios</h2>
              <span className="text-xs text-muted-foreground ml-auto">
                Personalizados para seu perfil
              </span>
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
        {todayData.meals.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed size={18} strokeWidth={1.5} className="text-secondary" />
              <h2 className="text-base font-medium text-foreground">Cardápio do Dia</h2>
              <span className="text-xs text-muted-foreground ml-auto">
                Adaptado às suas restrições
              </span>
            </div>
            <div className="space-y-2">
              {todayData.meals.map((item) => (
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
              <span className="text-xs text-muted-foreground ml-auto">
                Alinhados ao seu objetivo
              </span>
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
