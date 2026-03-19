/**
 * Profile-based personalization engine
 * Reads user profile data and provides filtering/selection logic
 * for exercises, recipes, and habits based on onboarding answers.
 */

import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  name: string;
  age: number | null;
  sex: string;
  weightKg: number | null;
  heightCm: number | null;
  activityLevel: string;
  healthConditions: string[];
  painLevel: string;
  affectedAreas: string[];
  objectives: string[];
  dietaryRestrictions: string[];
  dietaryPreferences: string[];
  inflammatoryEnemies: string[];
  antiInflammatoryAllies: string[];
  avatarUrl: string | null;
}

export interface DbExercise {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  frequency: string | null;
  description: string;
  start_position: string | null;
  steps: string[];
  benefits: string | null;
  safety: string | null;
  variations: string[];
  icon: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

export interface DbRecipe {
  id: string;
  title: string;
  tipo_refeicao: string[];
  tags: string[];
  ingredients: string[];
  instructions: string[];
  por_que_resfria: string | null;
  dica: string | null;
  category: string;
  time: string | null;
  servings: string | null;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

export interface DbHabit {
  id: string;
  title: string;
  category: string | null;
  icon: string | null;
  modal_content: string | null;
  description: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

// ─── Parse onboarding data from localStorage or Supabase profile ───

export function parseOnboardingFromLocal(): UserProfile {
  const saved = localStorage.getItem("levvia_onboarding");
  if (!saved) return defaultProfile();
  try {
    const data = JSON.parse(saved);
    const bodyMetrics = (data[5] as string[]) || [];
    return {
      name: (data[2] as string) || "",
      age: parseInt(data[3] as string) || null,
      sex: (data[4] as string) || "",
      weightKg: parseFloat(bodyMetrics[0]) || null,
      heightCm: parseFloat(bodyMetrics[1]) || null,
      activityLevel: (data[6] as string) || "",
      healthConditions: (data[7] as string[]) || [],
      painLevel: (data[8] as string) || "Sem dor",
      affectedAreas: (data[9] as string[]) || [],
      objectives: (data[13] as string[]) || [],
      dietaryRestrictions: (data[14] as string[]) || [],
      dietaryPreferences: (data[15] as string[]) || [],
      inflammatoryEnemies: (data[11] as string[]) || [],
      antiInflammatoryAllies: (data[12] as string[]) || [],
      avatarUrl: null,
    };
  } catch {
    return defaultProfile();
  }
}

export async function parseOnboardingFromSupabase(userId: string): Promise<UserProfile> {
  const { data } = await supabase
    .from("profiles")
    .select("name, age, sex, weight_kg, height_cm, activity_level, health_conditions, pain_level, affected_areas, objectives, onboarding_data, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return parseOnboardingFromLocal(); // fallback

  const onb = (data.onboarding_data as Record<string, unknown>) || {};

  return {
    name: data.name || "",
    age: (data as any).age || null,
    sex: (data as any).sex || "",
    weightKg: (data as any).weight_kg || null,
    heightCm: (data as any).height_cm || null,
    activityLevel: (data as any).activity_level || "",
    healthConditions: (data as any).health_conditions || [],
    painLevel: data.pain_level || "Sem dor",
    affectedAreas: data.affected_areas || [],
    objectives: (data as any).objectives || [],
    dietaryRestrictions: (onb.restrictions as string[]) || [],
    dietaryPreferences: (onb.preferences as string[]) || [],
    inflammatoryEnemies: (onb.enemies as string[]) || [],
    antiInflammatoryAllies: (onb.allies as string[]) || [],
    avatarUrl: (data as any).avatar_url || null,
  };
}

function defaultProfile(): UserProfile {
  return {
    name: "",
    age: null,
    sex: "",
    weightKg: null,
    heightCm: null,
    activityLevel: "",
    healthConditions: [],
    painLevel: "Sem dor",
    affectedAreas: [],
    objectives: [],
    dietaryRestrictions: [],
    dietaryPreferences: [],
    inflammatoryEnemies: [],
    antiInflammatoryAllies: [],
    avatarUrl: null,
  };
}

// ─── Exercise filtering by profile ───

/** Levels allowed per pain level */
const painToLevels: Record<string, string[]> = {
  "Sem dor": ["Muito Fácil", "Fácil", "Moderado"],
  "Dor leve": ["Muito Fácil", "Fácil", "Moderado"],
  "Dor moderada": ["Muito Fácil", "Fácil"],
  "Dor intensa": ["Muito Fácil", "Fácil"],
  "Dor muito intensa": ["Muito Fácil"],
};

/** Priority categories per pain level (order matters) */
const painToPriorityCategories: Record<string, string[]> = {
  "Sem dor": [
    "Caminhada e Movimento Funcional",
    "Fortalecimento Leve",
    "Movimento Articular Suave",
    "Drenagem Linfática Manual",
    "Respiração e Relaxamento",
  ],
  "Dor leve": [
    "Movimento Articular Suave",
    "Drenagem Linfática Manual",
    "Fortalecimento Leve",
    "Respiração e Relaxamento",
    "Caminhada e Movimento Funcional",
  ],
  "Dor moderada": [
    "Drenagem Linfática Manual",
    "Respiração e Relaxamento",
    "Movimento Articular Suave",
    "Posições de Alívio de Dor",
  ],
  "Dor intensa": [
    "Posições de Alívio de Dor",
    "Respiração e Relaxamento",
    "Drenagem Linfática Manual",
  ],
  "Dor muito intensa": [
    "Posições de Alívio de Dor",
    "Respiração e Relaxamento",
  ],
};

/** Maps affected body areas to relevant exercise titles/categories */
const areaToExerciseKeywords: Record<string, string[]> = {
  "Coxas": ["quadríceps", "coxa", "ponte", "glúteos", "abertura de pernas", "isquiotibiais"],
  "Quadris": ["quadril", "ponte", "glúteos", "borboleta", "abertura"],
  "Panturrilhas": ["panturrilha", "calcanhares", "tornozelos"],
  "Braços": ["braço", "parede", "flexão"],
  "Tornozelos": ["tornozelo", "pés", "flexão e extensão"],
  "Joelhos": ["joelho", "círculos"],
};

/** Objective to priority categories */
const objectiveToPriority: Record<string, string[]> = {
  "Reduzir a dor e o desconforto": ["Posições de Alívio de Dor", "Respiração e Relaxamento"],
  "Melhorar a mobilidade": ["Movimento Articular Suave", "Caminhada e Movimento Funcional"],
  "Controlar o inchaço": ["Drenagem Linfática Manual", "Posições de Alívio de Dor"],
  "Adotar alimentação anti-inflamatória": [], // no exercise priority change
  "Criar uma rotina de exercícios": ["Fortalecimento Leve", "Caminhada e Movimento Funcional"],
  "Melhorar o bem-estar emocional": ["Respiração e Relaxamento", "Posições de Alívio de Dor"],
};

export function filterExercisesForProfile(
  exercises: DbExercise[],
  profile: UserProfile
): DbExercise[] {
  const allowedLevels = painToLevels[profile.painLevel] || painToLevels["Sem dor"];
  
  // Filter by level
  let filtered = exercises.filter(
    (e) => e.is_active !== false && allowedLevels.includes(e.level)
  );

  return filtered;
}

export function scoreExercise(exercise: DbExercise, profile: UserProfile): number {
  let score = 0;

  // Pain-based category priority
  const painCategories = painToPriorityCategories[profile.painLevel] || [];
  const painIdx = painCategories.indexOf(exercise.category);
  if (painIdx >= 0) {
    score += (painCategories.length - painIdx) * 10;
  }

  // Objective-based priority
  const objCategories = objectiveToPriority[profile.objective] || [];
  if (objCategories.includes(exercise.category)) {
    score += 15;
  }

  // Affected areas relevance
  for (const area of profile.affectedAreas) {
    const keywords = areaToExerciseKeywords[area] || [];
    const titleLower = exercise.title.toLowerCase();
    for (const kw of keywords) {
      if (titleLower.includes(kw.toLowerCase())) {
        score += 8;
        break;
      }
    }
  }

  return score;
}

export function selectExercisesForDay(
  allExercises: DbExercise[],
  profile: UserProfile,
  day: number,
  count: number = 2
): DbExercise[] {
  const filtered = filterExercisesForProfile(allExercises, profile);
  if (filtered.length === 0) return [];

  // Score all exercises
  const scored = filtered.map((e) => ({ exercise: e, score: scoreExercise(e, profile) }));
  scored.sort((a, b) => b.score - a.score);

  // Use day as offset to rotate through exercises, ensuring variety
  const startIdx = ((day - 1) * count) % scored.length;
  const selected: DbExercise[] = [];

  for (let i = 0; i < count && i < scored.length; i++) {
    const idx = (startIdx + i) % scored.length;
    selected.push(scored[idx].exercise);
  }

  // Ensure we don't pick two from same category if possible
  if (selected.length === 2 && selected[0].category === selected[1].category && scored.length > 2) {
    // Replace second with next best from different category
    for (let i = 0; i < scored.length; i++) {
      const idx = (startIdx + count + i) % scored.length;
      if (scored[idx].exercise.category !== selected[0].category) {
        selected[1] = scored[idx].exercise;
        break;
      }
    }
  }

  return selected;
}

// ─── Recipe filtering by profile ───

export function filterRecipesForProfile(
  recipes: DbRecipe[],
  profile: UserProfile
): DbRecipe[] {
  let filtered = recipes.filter((r) => r.is_active !== false);

  // Dietary restrictions
  if (profile.dietaryRestrictions.includes("Vegano")) {
    filtered = filtered.filter((r) => r.tags.includes("Vegano"));
  } else if (profile.dietaryRestrictions.includes("Vegetariano")) {
    filtered = filtered.filter((r) => r.tags.includes("Vegetariano") || r.tags.includes("Vegano"));
  }
  if (profile.dietaryRestrictions.includes("Sem Glúten")) {
    filtered = filtered.filter((r) => r.tags.includes("Sem Glúten"));
  }
  if (profile.dietaryRestrictions.includes("Sem Lactose")) {
    filtered = filtered.filter((r) => r.tags.includes("Sem Lactose"));
  }
  if (profile.dietaryRestrictions.includes("Alergia a Frutos do Mar")) {
    filtered = filtered.filter((r) =>
      !r.ingredients.some((i) => /salmão|peixe|tilápia|atum|sardinha|camarão|frutos do mar/i.test(i))
    );
  }
  if (profile.dietaryRestrictions.includes("Alergia a Amendoim")) {
    filtered = filtered.filter((r) => !r.ingredients.some((i) => /amendoim/i.test(i)));
  }
  if (profile.dietaryRestrictions.includes("Alergia a Oleaginosas")) {
    filtered = filtered.filter((r) =>
      !r.ingredients.some((i) => /nozes|castanha|amêndoa|amendoa|pistache|avelã/i.test(i))
    );
  }

  // Dietary preferences
  if (profile.dietaryPreferences.includes("Prefiro refeições rápidas")) {
    // Prioritize but don't exclude: sort by time
    filtered.sort((a, b) => {
      const timeA = parseMinutes(a.time || "");
      const timeB = parseMinutes(b.time || "");
      return timeA - timeB;
    });
  }
  if (profile.dietaryPreferences.includes("Prefiro refeições com poucos ingredientes")) {
    filtered.sort((a, b) => (a.ingredients?.length || 0) - (b.ingredients?.length || 0));
  }
  if (profile.dietaryPreferences.includes("Não gosto de coentro")) {
    filtered = filtered.filter((r) => !r.ingredients.some((i) => /coentro/i.test(i)));
  }
  if (profile.dietaryPreferences.includes("Não gosto de pimenta")) {
    filtered = filtered.filter((r) =>
      !r.ingredients.some((i) => /pimenta(?!.*reino)/i.test(i))
    );
  }

  return filtered;
}

function parseMinutes(time: string): number {
  const match = time.match(/(\d+)/);
  return match ? parseInt(match[1]) : 30;
}

// ─── Habit selection by objective ───

const objectiveToHabitCategories: Record<string, string[]> = {
  "Reduzir a dor e o desconforto": ["Alívio", "Relaxamento", "Autocuidado"],
  "Melhorar a mobilidade": ["Movimento", "Autocuidado", "Hidratação"],
  "Controlar o inchaço": ["Drenagem", "Hidratação", "Compressão"],
  "Adotar alimentação anti-inflamatória": ["Nutrição", "Hidratação"],
  "Criar uma rotina de exercícios": ["Movimento", "Motivação", "Autocuidado"],
  "Melhorar o bem-estar emocional": ["Relaxamento", "Autocuidado", "Mindfulness"],
};

export function selectHabitsForDay(
  allHabits: DbHabit[],
  profile: UserProfile,
  day: number,
  count: number = 2
): DbHabit[] {
  const active = allHabits.filter((h) => h.is_active !== false);
  if (active.length === 0) return [];

  const priorityCategories = objectiveToHabitCategories[profile.objective] || [];

  // Score habits
  const scored = active.map((h) => {
    let score = 0;
    for (const cat of priorityCategories) {
      if (h.category?.toLowerCase().includes(cat.toLowerCase())) {
        score += 10;
        break;
      }
      if (h.title.toLowerCase().includes(cat.toLowerCase())) {
        score += 5;
      }
    }
    return { habit: h, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Rotate by day
  const startIdx = ((day - 1) * count) % scored.length;
  const selected: DbHabit[] = [];
  for (let i = 0; i < count && i < scored.length; i++) {
    const idx = (startIdx + i) % scored.length;
    selected.push(scored[idx].habit);
  }

  return selected;
}

// ─── Fetch data from Supabase ───

export async function fetchExercises(): Promise<DbExercise[]> {
  const { data } = await supabase
    .from("exercises")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return (data as DbExercise[]) || [];
}

export async function fetchRecipes(): Promise<DbRecipe[]> {
  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return (data as DbRecipe[]) || [];
}

export async function fetchHabits(): Promise<DbHabit[]> {
  const { data } = await supabase
    .from("habits")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return (data as DbHabit[]) || [];
}

// ─── Pain level helpers ───

export function isHighPain(painLevel: string): boolean {
  return painLevel === "Dor intensa" || painLevel === "Dor muito intensa";
}

export function getPainSeverity(painLevel: string): "low" | "moderate" | "high" {
  if (painLevel === "Sem dor" || painLevel === "Dor leve") return "low";
  if (painLevel === "Dor moderada") return "moderate";
  return "high";
}
