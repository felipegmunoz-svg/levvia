import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { startOfDay, addDays } from "date-fns";
import { debugRender, debugMount, debugUnmount, isDebugActive, getDebugCounters } from "@/lib/renderDebug";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import { Dumbbell, UtensilsCrossed, Heart, X, Sparkles, BarChart3 } from "lucide-react";

import ProgressDashboard from "@/components/ProgressDashboard";
import ChecklistItemCard from "@/components/ChecklistItemCard";
import ExerciseDetail from "@/components/ExerciseDetail";
import RecipeDetail from "@/components/RecipeDetail";
import BottomNav from "@/components/BottomNav";
import SymptomDiary from "@/components/SymptomDiary";
import MotorAlivio from "@/components/MotorAlivio";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";
import HeatMapCard from "@/components/HeatMapCard";
import FoodTrafficLightCard from "@/components/FoodTrafficLightCard";
import Day1Flow from "@/components/journey/Day1Flow";
import Day2Flow from "@/components/journey/Day2Flow";
import Day3Flow from "@/components/journey/Day3Flow";
import Day4Flow from "@/components/journey/Day4Flow";
import Day5Flow from "@/components/journey/Day5Flow";
import Day6Flow from "@/components/journey/Day6Flow";
import PaywallModal from "@/components/journey/PaywallModal";
import WaitingScreen from "@/components/journey/WaitingScreen";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
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
  const renderCount = useRef(0);
  renderCount.current++;
  const [searchParams] = useSearchParams();
  const reviewDay = searchParams.get("review") ? Number(searchParams.get("review")) : null;
  
  const navTo = useNavigate();

  useEffect(() => {
    debugMount("Today");
    return () => debugUnmount("Today");
  }, []);
  const { user, loading: authLoading } = useAuth();
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

  const { hasPremium, loading: premiumLoading } = usePremium();
  const [day1Done, setDay1Done] = useState<boolean | null>(null);
  const [day2Done, setDay2Done] = useState<boolean | null>(null);
  const [day3Done, setDay3Done] = useState<boolean | null>(null);
  const [day4Done, setDay4Done] = useState<boolean | null>(null);
  const [day5Done, setDay5Done] = useState<boolean | null>(null);
  const [day6Done, setDay6Done] = useState<boolean | null>(null);
  const [day1CompletedAt, setDay1CompletedAt] = useState<string | null>(null);
  const [day2CompletedAt, setDay2CompletedAt] = useState<string | null>(null);
  const [day3CompletedAt, setDay3CompletedAt] = useState<string | null>(null);
  const [day4CompletedAt, setDay4CompletedAt] = useState<string | null>(null);
  const [day5CompletedAt, setDay5CompletedAt] = useState<string | null>(null);
  const [day6CompletedAt, setDay6CompletedAt] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Debug render instrumentation
  const branch = day1Done === null || day2Done === null || day3Done === null || day4Done === null || day5Done === null || day6Done === null || premiumLoading
    ? "LOADING_GATES"
    : day1Done === false ? "DAY1_FLOW"
    : day2Done === false && day1Done === true ? "DAY2_FLOW"
    : day3Done === false && day2Done === true ? "DAY3_FLOW"
    : day3Done === true && day4Done === false && !hasPremium ? "PAYWALL"
    : day4Done === false && day3Done === true && hasPremium ? "DAY4_FLOW"
    : day5Done === false && day4Done === true && hasPremium ? "DAY5_FLOW"
    : day6Done === false && day5Done === true && hasPremium ? "DAY6_FLOW"
    : day6Done === true && hasPremium ? "DAY6_DONE"
    : "DASHBOARD";
  
  debugRender("Today", {
    renderNum: renderCount.current, branch, currentDay, authLoading, loading, premiumLoading,
    day1Done, day2Done, day3Done, day4Done, day5Done, hasPremium,
    hasTodayData: !!todayData, forceReady: false,
  });

  const DEBUG_EMAILS = ['felipegmunoz@gmail.com', 'teste_levvia_dia3_2026@gmail.com'];
  const isAuthorized = !!user?.email && DEBUG_EMAILS.includes(user.email.toLowerCase());
  const isDev = (import.meta.env.MODE === 'development' || localStorage.getItem('levvia_debug') === 'true') && isAuthorized;

  const [replayDay, setReplayDay] = useState<number | null>(null);

  const handleResetLocal = () => {
    ['levvia_day1_progress', 'levvia_day2_progress', 'levvia_day3_progress', 'levvia_day4_progress', 'levvia_day5_progress', 'levvia_challenge_progress'].forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  // Check day completion and timestamps from Supabase (with proper cleanup)
  useEffect(() => {
    if (!user?.id) {
      setDay1Done(true);
      setDay2Done(true);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        console.warn("⚠️ Timeout 5s ao buscar day completion — preservando estado atual");
        // Don't reset to false! Preserve current state (null means still loading)
      }
    }, 5000);

    supabase
      .from("profiles")
      .select("day1_completed, day1_completed_at, day2_completed, day2_completed_at, day3_completed, day3_completed_at, day4_completed, day4_completed_at, day5_completed, day5_completed_at, day6_completed, day6_completed_at, challenge_start")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        clearTimeout(timer);
        if (cancelled) return;
        if (error) {
          console.warn("⚠️ Erro ao buscar day completion, preservando estado", error);
          return;
        }
        setDay1Done(data?.day1_completed === true);
        setDay2Done(data?.day2_completed === true);
        setDay3Done(data?.day3_completed === true);
        setDay4Done(data?.day4_completed === true);
        setDay5Done(data?.day5_completed === true);
        setDay6Done(data?.day6_completed === true);
        setDay1CompletedAt(data?.day1_completed_at || null);
        setDay2CompletedAt(data?.day2_completed_at || null);
        setDay3CompletedAt(data?.day3_completed_at || null);
        setDay4CompletedAt(data?.day4_completed_at || null);
        setDay5CompletedAt(data?.day5_completed_at || null);
        setDay6CompletedAt(data?.day6_completed_at || null);
        if (data?.challenge_start) {
          localStorage.setItem("levvia_challenge_start", data.challenge_start);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [user?.id]);

  // Safety timeout: force loading off if useChallengeData never resolves
  const [forceReady, setForceReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("⚠️ Safety timeout 8s atingido, forçando renderização");
        setForceReady(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [loading]);

  const [selectedExercise, setSelectedExercise] = useState<{ exercise: DbExercise; activityId: string } | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<{ recipe: DbRecipe; activityId: string } | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

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
  if (day1Done === null || day2Done === null || day3Done === null || day4Done === null || day5Done === null || day6Done === null || premiumLoading) {
    return (
      <>
        {isDev && (
          <div className="bg-yellow-100 px-3 py-2 flex flex-wrap gap-2 items-center text-xs sticky top-0 z-50">
            <span className="font-semibold text-yellow-800">🐛 Debug:</span>
            {[1,2,3,4,5,6].map(d => (
              <button key={d} onClick={() => setReplayDay(d)} className="px-2 py-1 bg-yellow-300 text-yellow-900 rounded">
                Dia {d}
              </button>
            ))}
            <button onClick={handleResetLocal} className="px-2 py-1 bg-red-300 text-red-900 rounded ml-auto">
              Resetar Local
            </button>
          </div>
        )}
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  // --- Compute content to show ---
  let content: React.ReactNode = null;

  // Debug replay: bypass all gates
  if (replayDay === 1) content = <Day1Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 2) content = <Day2Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 3) content = <Day3Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 4) content = <Day4Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 5) content = <Day5Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 6) content = <Day6Flow onComplete={() => setReplayDay(null)} />;

  // Review mode: revisit completed days (read-only, navigates back to /journey)
  else if (reviewDay) {
    
    const goBack = () => navTo("/journey");
    if (reviewDay === 1) content = <Day1Flow onComplete={goBack} isReviewMode={true} />;
    else if (reviewDay === 2) content = <Day2Flow onComplete={goBack} isReviewMode={true} />;
    else if (reviewDay === 3) content = <Day3Flow onComplete={goBack} isReviewMode={true} />;
    else if (reviewDay === 4) content = <Day4Flow onComplete={goBack} isReviewMode={true} />;
    else if (reviewDay === 5) content = <Day5Flow onComplete={goBack} isReviewMode={true} />;
    else if (reviewDay === 6) content = <Day6Flow onComplete={goBack} isReviewMode={true} />;
  }

  else if (day1Done === false) {
    content = <Day1Flow onComplete={() => setDay1Done(true)} />;
  }

  else if (day2Done === false && day1Done === true) {
    if (!isDev && day1CompletedAt) {
      const nextMidnight = startOfDay(addDays(new Date(day1CompletedAt), 1));
      if (Date.now() < nextMidnight.getTime()) {
        content = (
          <WaitingScreen
            completedAt={day1CompletedAt}
            nextDay={2}
            onReady={() => setDay1CompletedAt(new Date(Date.now() - 25 * 3600000).toISOString())}
          />
        );
      }
    }
    if (!content) content = <Day2Flow onComplete={() => setDay2Done(true)} />;
  }

  else if (day3Done === false && day2Done === true) {
    if (!isDev && day2CompletedAt) {
      const nextMidnight = startOfDay(addDays(new Date(day2CompletedAt), 1));
      if (Date.now() < nextMidnight.getTime()) {
        content = (
          <WaitingScreen
            completedAt={day2CompletedAt}
            nextDay={3}
            onReady={() => setDay2CompletedAt(new Date(Date.now() - 25 * 3600000).toISOString())}
          />
        );
      }
    }
    if (!content) content = <Day3Flow onComplete={() => setDay3Done(true)} />;
  }

  else if (day3Done === true && day4Done === false && !hasPremium) {
    content = <PaywallModal onClose={() => setShowPaywall(false)} />;
  }

  else if (day4Done === false && day3Done === true && hasPremium) {
    if (!isDev && day3CompletedAt) {
      const nextMidnight = startOfDay(addDays(new Date(day3CompletedAt), 1));
      if (Date.now() < nextMidnight.getTime()) {
        content = (
          <WaitingScreen
            completedAt={day3CompletedAt}
            nextDay={4}
            onReady={() => setDay3CompletedAt(new Date(Date.now() - 25 * 3600000).toISOString())}
          />
        );
      }
    }
    if (!content) content = <Day4Flow onComplete={() => setDay4Done(true)} />;
  }

  else if (day5Done === false && day4Done === true && hasPremium) {
    if (!isDev && day4CompletedAt) {
      const nextMidnight = startOfDay(addDays(new Date(day4CompletedAt), 1));
      if (Date.now() < nextMidnight.getTime()) {
        content = (
          <WaitingScreen
            completedAt={day4CompletedAt}
            nextDay={5}
            onReady={() => setDay4CompletedAt(new Date(Date.now() - 25 * 3600000).toISOString())}
          />
        );
      }
    }
    if (!content) content = <Day5Flow onComplete={() => setDay5Done(true)} />;
  }

  else if (day6Done === false && day5Done === true && hasPremium) {
    if (!isDev && day5CompletedAt) {
      const nextMidnight = startOfDay(addDays(new Date(day5CompletedAt), 1));
      if (Date.now() < nextMidnight.getTime()) {
        content = (
          <WaitingScreen
            completedAt={day5CompletedAt}
            nextDay={6}
            onReady={() => setDay5CompletedAt(new Date(Date.now() - 25 * 3600000).toISOString())}
          />
        );
      }
    }
    if (!content) content = <Day6Flow onComplete={() => setDay6Done(true)} />;
  }

  else if (day6Done === true && hasPremium) {
    if (day6CompletedAt) {
      const nextMidnight = startOfDay(addDays(new Date(day6CompletedAt), 1));
      if (Date.now() < nextMidnight.getTime()) {
        content = (
          <WaitingScreen
            completedAt={day6CompletedAt}
            nextDay={7}
            onReady={() => setDay6CompletedAt(new Date(Date.now() - 25 * 3600000).toISOString())}
          />
        );
      }
    }
    if (!content) {
      content = (
        <div className="min-h-screen levvia-page p-6 flex flex-col items-center justify-center text-center">
          <span className="text-6xl mb-4">🚀</span>
          <h2 className="text-2xl font-heading font-bold text-levvia-fg mb-2">Dia 7 em breve!</h2>
          <p className="text-sm text-levvia-muted font-body max-w-xs">
            Estamos preparando o próximo passo da sua jornada.
            Enquanto isso, continue praticando os aprendizados dos dias anteriores.
          </p>
        </div>
      );
    }
  }

  else if (selectedExercise) {
    content = (
      <ExerciseDetail
        exercise={toExerciseView(selectedExercise.exercise)}
        onBack={() => setSelectedExercise(null)}
        onMarkDone={handleMarkExerciseDone}
      />
    );
  }

  else if (selectedRecipe) {
    content = (
      <RecipeDetail
        recipe={toRecipeView(selectedRecipe.recipe)}
        onBack={() => setSelectedRecipe(null)}
        onMarkDone={handleMarkRecipeDone}
      />
    );
  }

  else if ((loading && !forceReady) || !todayData) {
    content = (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Personalizando seu plano...</p>
        </div>
      </div>
    );
  }

  // If no gate matched, render the dashboard
  if (!content) {
    content = (
    <div className="levvia-page min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-10 pb-8">
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
  }

  return (
    <>
      {isDev && (
        <div className="bg-yellow-100 px-3 py-2 flex flex-wrap gap-2 items-center text-xs sticky top-0 z-50">
          <span className="font-semibold text-yellow-800">🐛 Debug:</span>
          {[1, 2, 3, 4, 5, 6].map(d => (
            <button key={d} onClick={() => setReplayDay(d)} className="px-2 py-1 bg-yellow-300 text-yellow-900 rounded hover:bg-yellow-400 transition-colors">
              Dia {d}
            </button>
          ))}
          <button onClick={handleResetLocal} className="px-2 py-1 bg-red-300 text-red-900 rounded hover:bg-red-400 transition-colors ml-auto">
            Resetar Local
          </button>
        </div>
      )}
      {/* Debug overlay — activated via localStorage.setItem('levvia_debug_render', '1') */}
      {isDebugActive() && (
        <div style={{ position: 'fixed', bottom: 70, right: 8, zIndex: 9999, background: 'rgba(0,0,0,0.85)', color: '#0f0', padding: '8px 12px', borderRadius: 8, fontSize: 10, fontFamily: 'monospace', maxWidth: 260, pointerEvents: 'none' }}>
          <div>🔄 Today #{renderCount.current} | branch: {branch}</div>
          <div>day: {currentDay} | d1:{String(day1Done)} d2:{String(day2Done)} d3:{String(day3Done)} d4:{String(day4Done)} d5:{String(day5Done)} d6:{String(day6Done)}</div>
          <div>premium:{String(hasPremium)} pLoad:{String(premiumLoading)} cLoad:{String(loading)} auth:{String(authLoading)}</div>
          <div>data:{todayData ? 'yes' : 'no'}</div>
        </div>
      )}
      <div className="levvia-page">{content}</div>
    </>
  );
};

export default Today;
