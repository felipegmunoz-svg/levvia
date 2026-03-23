import { useState, useEffect, useMemo } from "react";
import { useProfile } from "./useProfile";
import { useAuth } from "./useAuth";
import {
  fetchExercises,
  fetchRecipes,
  fetchHabits,
  selectExercisesForDay,
  filterRecipesForProfile,
  selectHabitsForDay,
  isHighPain,
  type DbExercise,
  type DbRecipe,
  type DbHabit,
  type UserProfile,
} from "@/lib/profileEngine";
import { supabase } from "@/integrations/supabase/client";

let dataCache: { exercises: DbExercise[]; recipes: DbRecipe[]; habits: DbHabit[]; ts: number } | null = null;
const DATA_CACHE_TTL = 5 * 60_000; // 5 minutes

export type MealSlot = "Café da Manhã" | "Lanche da Manhã" | "Almoço" | "Lanche da Tarde" | "Jantar";

export const mealSlots: MealSlot[] = [
  "Café da Manhã",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
];

export interface ChallengeActivity {
  id: string;
  type: "exercise" | "recipe" | "habit";
  label: string;
  exercise?: DbExercise;
  recipe?: DbRecipe;
  habit?: DbHabit;
  modalContent?: string;
}

interface DayData {
  exercises: ChallengeActivity[];
  meals: ChallengeActivity[];
  habits: ChallengeActivity[];
  phrase: string;
}

// Motivational phrases that adapt to pain level
const dailyPhrases = [
  { normal: "Cada pequeno passo é uma vitória. Comece hoje, com carinho por você.", high: "Seu corpo merece gentileza. Comece devagar, com amor por você." },
  { normal: "A leveza começa de dentro. Sinta seu corpo agradecer a cada movimento.", high: "Escute seu corpo com carinho. Cada toque suave é um passo para a leveza." },
  { normal: "Movimento é vida. Cada alongamento é um abraço para suas articulações.", high: "Mova-se no seu ritmo. Cada gesto suave é um ato de cuidado." },
  { normal: "Fortalecer-se é um ato de amor próprio. Vá no seu ritmo.", high: "Cada respiração profunda é um passo para o alívio. Respeite seus limites." },
  { normal: "Hidratar, nutrir, mover. Três pilares para a sua leveza.", high: "Você não está sozinha nessa jornada. Cada dia é uma nova oportunidade." },
  { normal: "Seu corpo é seu templo. Cuide dele com carinho e constância.", high: "A cura vem de dentro. Cada gesto gentil conta." },
  { normal: "Uma semana de cuidado! Celebre cada conquista, por menor que pareça.", high: "Metade da jornada! Cada dia que você chegou aqui é uma vitória." },
  { normal: "Transformação acontece um dia de cada vez. Continue firme!", high: "Permita-se descansar quando preciso. Descanso também é cuidado." },
  { normal: "Você é mais forte do que imagina. Confie no processo.", high: "Sua força interior é maior que qualquer desconforto. Um passo de cada vez." },
  { normal: "Alimentar-se bem é um ato revolucionário de autocuidado.", high: "Cada alimento anti-inflamatório é um presente para o seu corpo." },
  { normal: "A consistência supera a intensidade. Continue presente.", high: "Não precisa ser perfeito. Precisa ser constante e gentil." },
  { normal: "Seu corpo agradece cada escolha saudável que você faz.", high: "Observe as pequenas mudanças. Elas estão acontecendo." },
  { normal: "Penúltimo dia! Você está construindo hábitos para a vida.", high: "Você chegou até aqui! Isso mostra sua força e determinação." },
  { normal: "Último dia do desafio! Você é incrível. O cuidado continua! 🎉", high: "Parabéns! Cada dia dessa jornada foi um ato de coragem. Continue cuidando de si. 🎉" },
];

const dayTitles = [
  "Foco na Conexão e Despertar",
  "Foco na Drenagem e Leveza",
  "Foco na Mobilidade e Alívio",
  "Foco na Força Suave e Estabilidade",
  "Foco na Hidratação e Nutrição",
  "Foco no Relaxamento Profundo",
  "Celebrando a Primeira Semana",
  "Foco na Renovação e Energia",
  "Foco na Resiliência Interior",
  "Foco na Alimentação Consciente",
  "Foco na Constância e Presença",
  "Foco nas Conquistas Acumuladas",
  "Foco na Preparação para o Futuro",
  "Celebração Final do Desafio",
];

const dayObjectives = [
  "Iniciar a jornada com consciência e gentileza.",
  "Estimular a drenagem e sentir mais leveza.",
  "Melhorar a mobilidade e aliviar tensões.",
  "Fortalecer o corpo de forma gentil.",
  "Hidratar e nutrir o corpo de dentro pra fora.",
  "Relaxar profundamente e restaurar energia.",
  "Celebrar e reforçar os hábitos criados.",
  "Renovar a energia para a segunda semana.",
  "Desenvolver resiliência e autocompaixão.",
  "Conectar alimentação com bem-estar.",
  "Fortalecer a constância dos novos hábitos.",
  "Reconhecer e celebrar o progresso.",
  "Preparar-se para manter o cuidado contínuo.",
  "Celebrar a jornada e planejar o futuro.",
];

function getRecipesForSlot(filtered: DbRecipe[], slot: MealSlot): DbRecipe[] {
  const slotMapping: Record<MealSlot, string[]> = {
    "Café da Manhã": ["Café da Manhã"],
    "Lanche da Manhã": ["Lanche da Manhã", "Lanche"],
    "Almoço": ["Almoço"],
    "Lanche da Tarde": ["Lanche da Tarde", "Lanche"],
    "Jantar": ["Jantar"],
  };
  const types = slotMapping[slot];
  return filtered.filter((r) =>
    r.tipo_refeicao?.some((t) => types.some((st) => t === st))
  );
}

function generateMealsForDay(
  filteredRecipes: DbRecipe[],
  day: number
): Record<MealSlot, DbRecipe | null> {
  const meals: Record<MealSlot, DbRecipe | null> = {
    "Café da Manhã": null,
    "Lanche da Manhã": null,
    "Almoço": null,
    "Lanche da Tarde": null,
    "Jantar": null,
  };

  for (const slot of mealSlots) {
    const available = getRecipesForSlot(filteredRecipes, slot);
    if (available.length > 0) {
      const idx = ((day - 1)) % available.length;
      meals[slot] = available[idx];
    }
  }

  return meals;
}

export function useChallengeData() {
  const { profile, loading: profileLoading } = useProfile();
  const { user } = useAuth();
  const [exercises, setExercises] = useState<DbExercise[]>([]);
  const [recipes, setRecipes] = useState<DbRecipe[]>([]);
  const [habits, setHabits] = useState<DbHabit[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [challengeProgress, setChallengeProgress] = useState<Record<string, Record<string, boolean>>>({});

  const [challengeStart, setChallengeStart] = useState<string | null>(null);

  // Compute currentDay from Supabase challenge_start (cross-device)
  const currentDay = useMemo(() => {
    const start = challengeStart || localStorage.getItem("levvia_challenge_start");
    if (!start) return 1;
    const diff = Date.now() - new Date(start).getTime();
    const day = Math.floor(diff / 86400000) + 1;
    return Math.min(Math.max(day, 1), 14);
  }, [challengeStart]);

  // Load progress and challenge_start from Supabase
  useEffect(() => {
    const loadProgress = async () => {
      console.log("📂 Carregando progresso...");
      if (user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("challenge_progress, challenge_start")
          .eq("id", user.id)
          .maybeSingle();
        if (error) {
          console.error("❌ Erro ao carregar progresso:", error);
        }
        // Sync challenge_start from Supabase (cross-device)
        if (data?.challenge_start) {
          console.log("✅ challenge_start carregado do Supabase:", data.challenge_start);
          setChallengeStart(data.challenge_start);
          localStorage.setItem("levvia_challenge_start", data.challenge_start);
        } else {
          console.warn("⚠️ challenge_start não encontrado no Supabase");
          localStorage.removeItem("levvia_challenge_start");
        }
        if (data?.challenge_progress && typeof data.challenge_progress === "object") {
          console.log("✅ Progresso carregado do Supabase");
          setChallengeProgress(data.challenge_progress as Record<string, Record<string, boolean>>);
        } else {
          console.log("⚠️ Sem progresso no Supabase, usando localStorage");
          const saved = localStorage.getItem("levvia_challenge_progress");
          if (saved) setChallengeProgress(JSON.parse(saved));
        }
      } else {
        console.log("⚠️ Sem usuário, usando localStorage");
        const saved = localStorage.getItem("levvia_challenge_progress");
        if (saved) setChallengeProgress(JSON.parse(saved));
      }
    };
    loadProgress();
  }, [user?.id]);

  // Save progress to both localStorage and Supabase
  const saveProgress = async (newProgress: Record<string, Record<string, boolean>>) => {
    console.log("💾 Salvando progresso...", Object.keys(newProgress));
    setChallengeProgress(newProgress);
    localStorage.setItem("levvia_challenge_progress", JSON.stringify(newProgress));
    if (user?.id) {
      const { error } = await supabase.from("profiles").update({
        challenge_progress: newProgress as any,
        challenge_start: localStorage.getItem("levvia_challenge_start"),
      }).eq("id", user.id);
      if (error) {
        console.error("❌ Erro ao salvar progresso:", error);
      } else {
        console.log("✅ Progresso salvo no banco");
      }
    } else {
      console.log("⚠️ Sem usuário autenticado, salvo apenas em localStorage");
    }
  };

  // Fetch data from Supabase
  useEffect(() => {
    const load = async () => {
      if (dataCache && Date.now() - dataCache.ts < DATA_CACHE_TTL) {
        console.log("✅ [Cache] Dados carregados do cache");
        setExercises(dataCache.exercises);
        setRecipes(dataCache.recipes);
        setHabits(dataCache.habits);
        setDataLoading(false);
        return;
      }
      setDataLoading(true);
      const [exData, recData, habData] = await Promise.all([
        fetchExercises(),
        fetchRecipes(),
        fetchHabits(),
      ]);
      setExercises(exData);
      setRecipes(recData);
      setHabits(habData);
      dataCache = { exercises: exData, recipes: recData, habits: habData, ts: Date.now() };
      setDataLoading(false);
    };
    load();
  }, []);

  // Filtered recipes based on profile
  const filteredRecipes = useMemo(
    () => filterRecipesForProfile(recipes, profile),
    [recipes, profile]
  );

  // Generate today's data
  const todayData = useMemo((): DayData | null => {
    if (dataLoading || profileLoading) return null;

    // Exercises personalized by profile
    const dayExercises = selectExercisesForDay(exercises, profile, currentDay, 2);
    const exerciseActivities: ChallengeActivity[] = dayExercises.map((ex, i) => ({
      id: `day${currentDay}-ex${i + 1}`,
      type: "exercise" as const,
      label: ex.title,
      exercise: ex,
    }));

    // Meals personalized by profile restrictions + preferences
    const dayMeals = generateMealsForDay(filteredRecipes, currentDay);
    const mealActivities: ChallengeActivity[] = mealSlots
      .filter((slot) => dayMeals[slot] !== null)
      .map((slot) => ({
        id: `day${currentDay}-meal-${slot.replace(/\s/g, "")}`,
        type: "recipe" as const,
        label: `${slot}: ${dayMeals[slot]!.title}`,
        recipe: dayMeals[slot]!,
      }));

    // Habits personalized by objective
    const dayHabits = selectHabitsForDay(habits, profile, currentDay, 2);
    const habitActivities: ChallengeActivity[] = dayHabits.map((h, i) => ({
      id: `day${currentDay}-hab${i + 1}`,
      type: "habit" as const,
      label: h.title,
      habit: h,
      modalContent: h.modal_content || undefined,
    }));

    // Phrase based on pain level
    const phraseData = dailyPhrases[(currentDay - 1) % dailyPhrases.length];
    const phrase = isHighPain(profile.painLevel) ? phraseData.high : phraseData.normal;

    return {
      exercises: exerciseActivities,
      meals: mealActivities,
      habits: habitActivities,
      phrase,
    };
  }, [exercises, filteredRecipes, habits, profile, currentDay, dataLoading, profileLoading]);

  const dayTitle = dayTitles[(currentDay - 1) % dayTitles.length];
  const dayObjective = dayObjectives[(currentDay - 1) % dayObjectives.length];

  return {
    profile,
    currentDay,
    todayData,
    dayTitle,
    dayObjective,
    loading: dataLoading || profileLoading,
    allExercises: exercises,
    allRecipes: recipes,
    filteredRecipes,
    allHabits: habits,
    challengeProgress,
    saveProgress,
  };
}
