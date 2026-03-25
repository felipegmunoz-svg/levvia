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
  pantryItems: string[];
  avatarUrl: string | null;
  heatMapDay1: Record<string, number>;
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
  pain_suitability: number | null;
  body_part: string[] | null;
  environment: string[] | null;
  movement_type: string | null;
  clinical_benefit: string | null;
  duration_seconds: number | null;
  image_urls?: string[];
  video_url?: string | null;
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
  journey_day: number | null;
  journey_role: string | null;
  diet_profile: string[] | null;
  allergen_free: string[] | null;
  pantry_complexity: string | null;
  main_ingredients: string[] | null;
  common_pantry_match: number | null;
  health_goals: string[] | null;
  inflammation_score: number | null;
  theme_tags: string[] | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  difficulty: string | null;
  nutritional_highlights: string | null;
  image_url: string | null;
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
    const heatMapRaw = data[9];
    const heatMapLabels: Record<string, string> = {
      panturrilha_esq: "Panturrilhas",
      panturrilha_dir: "Panturrilhas",
      coxa_esq: "Coxas",
      coxa_dir: "Coxas",
      quadril_esq: "Quadris",
      quadril_dir: "Quadris",
      abdomen: "Abdômen/Barriga",
      braco_esq: "Braços",
      braco_dir: "Braços",
    };

    let heatMapDay1: Record<string, number> = {};
    let affectedAreas: string[] = [];

    if (heatMapRaw && typeof heatMapRaw === "object" && !Array.isArray(heatMapRaw)) {
      heatMapDay1 = Object.fromEntries(
        Object.entries(heatMapRaw).filter(([, value]) => typeof value === "number") as Array<[string, number]>
      );
      affectedAreas = Array.from(
        new Set(
          Object.entries(heatMapDay1)
            .filter(([, value]) => value > 0)
            .map(([key]) => heatMapLabels[key])
            .filter(Boolean)
        )
      );
    } else if (Array.isArray(heatMapRaw)) {
      affectedAreas = heatMapRaw;
    }

    return {
      name: (data[2] as string) || "",
      age: parseInt(data[3] as string) || null,
      sex: (data[4] as string) || "",
      weightKg: parseFloat(bodyMetrics[0]) || null,
      heightCm: parseFloat(bodyMetrics[1]) || null,
      activityLevel: (data[6] as string) || "",
      healthConditions: (data[7] as string[]) || [],
      painLevel: (data[8] as string) || "Sem dor",
      affectedAreas,
      // New IDs: 13=restrictions, 14=preferences, 15=pantry, 16=objectives
      objectives: (data[16] as string[]) || [],
      dietaryRestrictions: (data[13] as string[]) || [],
      dietaryPreferences: (data[14] as string[]) || [],
      inflammatoryEnemies: (data[11] as string[]) || [],
      antiInflammatoryAllies: (data[12] as string[]) || [],
      pantryItems: (data[15] as string[]) || [],
      avatarUrl: null,
      heatMapDay1,
    };
  } catch {
    return defaultProfile();
  }
}

export async function parseOnboardingFromSupabase(userId: string): Promise<UserProfile> {
  

  const { data, error } = await supabase
    .from("profiles")
    .select("name, age, sex, weight_kg, height_cm, activity_level, health_conditions, pain_level, affected_areas, objectives, onboarding_data, avatar_url, pantry_items, heat_map_day1")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    
  }

  if (!data) {
    
    return parseOnboardingFromLocal();
  }

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
    pantryItems: (data as any).pantry_items || [],
    avatarUrl: (data as any).avatar_url || null,
    heatMapDay1: (data as any).heat_map_day1 && typeof (data as any).heat_map_day1 === 'object' ? (data as any).heat_map_day1 as Record<string, number> : {},
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
    pantryItems: [],
    avatarUrl: null,
    heatMapDay1: {},
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

  // Objective-based priority (iterate all objectives)
  for (const obj of profile.objectives) {
    const objCategories = objectiveToPriority[obj] || [];
    if (objCategories.includes(exercise.category)) {
      score += 15;
    }
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

  // Pantry-based boost: sort recipes that match more pantry items higher
  if (profile.pantryItems.length > 0) {
    const pantryLower = profile.pantryItems.map((p) => p.toLowerCase());
    filtered.sort((a, b) => {
      const scoreA = scorePantryMatch(a, pantryLower);
      const scoreB = scorePantryMatch(b, pantryLower);
      return scoreB - scoreA; // higher match first
    });
  }

  return filtered;
}

function scorePantryMatch(recipe: DbRecipe, pantryLower: string[]): number {
  if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;
  let matches = 0;
  for (const ing of recipe.ingredients) {
    const ingLower = ing.toLowerCase();
    for (const p of pantryLower) {
      if (ingLower.includes(p) || p.includes(ingLower.split(" ")[0])) {
        matches++;
        break;
      }
    }
  }
  return matches;
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

  // Merge priority categories from all objectives
  const priorityCategories: string[] = [];
  for (const obj of profile.objectives) {
    const cats = objectiveToHabitCategories[obj] || [];
    for (const c of cats) {
      if (!priorityCategories.includes(c)) priorityCategories.push(c);
    }
  }

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

// ─── Intelligent Recipe Selection Engine (Day 1) ───

const mapObjectivesToHealthGoals = (objectives: string[]): string[] => {
  const mapping: Record<string, string[]> = {
    "Reduzir a dor e o desconforto": ["desinflamar"],
    "Melhorar a qualidade do sono": ["sono"],
    "Aumentar a energia e disposição": ["energia"],
    "Melhorar a mobilidade e flexibilidade": ["mobilidade"],
    "Melhorar a mobilidade": ["mobilidade"],
    "Desintoxicar o organismo": ["detox"],
    "Reduzir o inchaço": ["desinflamar", "detox"],
    "Controlar o inchaço": ["desinflamar", "detox"],
    "Melhorar a digestão": ["detox"],
    "Melhorar o bem-estar emocional": ["energia"],
    "Criar uma rotina de exercícios": ["energia", "mobilidade"],
    "Adotar alimentação anti-inflamatória": ["desinflamar"],
  };

  const goals = new Set<string>();
  objectives.forEach(obj => {
    const mapped = mapping[obj] || [];
    mapped.forEach(goal => goals.add(goal));
  });
  return Array.from(goals);
};

const mapDietRestrictionToProfile = (restrictions: string[]): string => {
  const lower = restrictions.map(r => r.toLowerCase());
  if (lower.some(r => r.includes("vegan") || r === "vegano" || r === "vegana")) return "vegana";
  if (lower.some(r => r.includes("vegetarian") || r === "vegetariano" || r === "vegetariana")) return "vegetariana";
  return "onivora";
};

const mapAllergenRestrictions = (restrictions: string[]): string[] => {
  const mapping: Record<string, string> = {
    "sem glúten": "gluten",
    "sem lactose": "lactose",
    "alergia a oleaginosas": "nuts",
    "alergia a soja": "soy",
    "alergia a amendoim": "nuts",
  };

  return restrictions
    .map(r => mapping[r.toLowerCase()])
    .filter(Boolean) as string[];
};

export const selectDay1Recipe = async (profile: UserProfile): Promise<DbRecipe | null> => {
  try {
    const dietProfile = mapDietRestrictionToProfile(profile.dietaryRestrictions || []);
    const allergens = mapAllergenRestrictions(profile.dietaryRestrictions || []);
    const healthGoals = mapObjectivesToHealthGoals(profile.objectives || []);

    // 1. HARD CONSTRAINT
    let { data: candidates, error } = await supabase
      .from('recipes')
      .select('*')
      .or('journey_day.eq.1,journey_day.is.null')
      .contains('diet_profile', [dietProfile])
      .eq('is_active', true);

    if (error) {
      console.error('Erro ao buscar receitas:', error);
      return null;
    }

    // Filter allergens client-side
    if (allergens.length > 0 && candidates) {
      candidates = candidates.filter(recipe => {
        const free = (recipe as any).allergen_free || [];
        return allergens.every(a => free.includes(a));
      });
    }

    // Filter out incomplete recipes (missing ingredients or instructions)
    if (candidates) {
      const beforeCount = candidates.length;
      candidates = candidates.filter(r =>
        (r as any).ingredients?.length > 0 && (r as any).instructions?.length > 0
      );
      const filtered = beforeCount - candidates.length;
      if (filtered > 0) {
        console.warn(`⚠️ Motor — ${filtered}/${beforeCount} receitas removidas (ingredients/instructions vazios)`);
      }
    }

    // Fallback to maintenance recipes
    if (!candidates || candidates.length === 0) {
      const { data: fallback } = await supabase
        .from('recipes')
        .select('*')
        .eq('journey_role', 'maintenance')
        .contains('diet_profile', [dietProfile])
        .eq('is_active', true);

      candidates = fallback || [];
      if (allergens.length > 0) {
        candidates = candidates.filter(recipe => {
          const free = (recipe as any).allergen_free || [];
          return allergens.every(a => free.includes(a));
        });
      }

      // Also filter incomplete in fallback
      if (candidates.length > 0) {
        const beforeFallback = candidates.length;
        candidates = candidates.filter(r =>
          (r as any).ingredients?.length > 0 && (r as any).instructions?.length > 0
        );
        const filteredFallback = beforeFallback - candidates.length;
        if (filteredFallback > 0) {
          console.warn(`⚠️ Motor fallback — ${filteredFallback}/${beforeFallback} receitas removidas (vazias)`);
        }
      }
    }

    // Emergency fallback: if ALL candidates were filtered, pick ANY complete recipe
    if (!candidates || candidates.length === 0) {
      console.warn('🚨 Motor — TODAS as receitas candidatas estavam vazias! Buscando qualquer receita completa...');
      const { data: emergency } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_active', true)
        .not('ingredients', 'eq', '{}')
        .not('instructions', 'eq', '{}')
        .limit(10);

      candidates = emergency || [];
      if (candidates.length > 0) {
        console.log(`🆘 Motor — Fallback de emergência: ${candidates.length} receitas encontradas`);
      }
    }

    if (!candidates || candidates.length === 0) return null;

    // 2. SOFT CONSTRAINT: pantry match
    const userPantry = (profile.pantryItems || []).map(i => i.toLowerCase());

    const scored = candidates.map(recipe => {
      const recipeIngs = ((recipe as any).main_ingredients || []).map((i: string) => i.toLowerCase());
      const matchCount = recipeIngs.filter((ri: string) =>
        userPantry.some(pi => pi.includes(ri) || ri.includes(pi))
      ).length;
      const pantryScore = recipeIngs.length > 0
        ? (matchCount / recipeIngs.length) * 100
        : (recipe as any).common_pantry_match || 50;

      // 3. NARRATIVE FILTER: health goals overlap
      const recipeGoals: string[] = (recipe as any).health_goals || [];
      const goalOverlap = recipeGoals.filter(g => healthGoals.includes(g)).length;

      return { ...recipe, pantryScore, goalOverlap } as DbRecipe & { pantryScore: number; goalOverlap: number };
    });

    // --- Composite score with dynamic weights ---
    const pantrySize = userPantry.length;
    const commonWeight = pantrySize >= 15 ? 0.4 : pantrySize >= 10 ? 0.7 : 1.0;

    const withFinal = scored.map(r => {
      const commonWeighted = ((r as any).common_pantry_match || 0) * commonWeight;
      const inflammationScore = (r as any).inflammation_score || 0;

      // 1. BÔNUS DE COMPLEXIDADE
      const ingredientCount = ((r as any).main_ingredients || []).length;
      const complexityBonus = pantrySize >= 10
        ? (Math.min(ingredientCount, 6) / 6) * 50
        : 0;

      // 2. DIVERSITY SCORE
      const categories = new Set<string>();
      const themeTags: string[] = (r as any).theme_tags || [];
      const mainIngredients: string[] = (r as any).main_ingredients || [];

      if (
        themeTags.some((tag: string) => ['proteina-nobre', 'proteina-vegetal', 'proteico'].includes(tag)) ||
        mainIngredients.some((ing: string) => ['frango', 'salmão', 'peixe', 'atum', 'ovo', 'tofu', 'grão-de-bico', 'lentilha'].some(p => ing.toLowerCase().includes(p)))
      ) {
        categories.add('proteina');
      }
      if (
        mainIngredients.some((ing: string) => ['couve', 'brócolis', 'espinafre', 'tomate', 'cenoura', 'abobrinha', 'pimentão'].some(v => ing.toLowerCase().includes(v)))
      ) {
        categories.add('vegetal');
      }
      if (
        themeTags.includes('omega-3') || themeTags.includes('gorduras-boas') ||
        mainIngredients.some((ing: string) => ['salmão', 'azeite', 'abacate', 'castanhas', 'nozes'].some(g => ing.toLowerCase().includes(g)))
      ) {
        categories.add('gordura-boa');
      }
      if (
        mainIngredients.some((ing: string) => ['arroz integral', 'quinoa', 'batata-doce', 'aveia'].some(c => ing.toLowerCase().includes(c)))
      ) {
        categories.add('carboidrato');
      }
      const diversityScore = categories.size * 15;

      // 3. BOOST POR NÍVEL DE ATIVIDADE
      const activityLevel = profile.activityLevel || '';
      const hasProtein = categories.has('proteina');
      const activityBoost =
        (activityLevel.toLowerCase().includes('intensa') || activityLevel.toLowerCase().includes('intense')) && hasProtein
          ? 100
          : 0;

      // 4. FINAL SCORE COM TRIPLO AJUSTE
      const finalScore =
        r.pantryScore * 2.0 +
        r.goalOverlap * 10 +
        inflammationScore * 5 +
        commonWeighted * 3 +
        complexityBonus +
        diversityScore +
        activityBoost;

      return {
        ...r,
        commonWeighted,
        finalScore,
        inflammationScore,
        complexityBonus,
        diversityScore,
        diversityCategories: Array.from(categories),
        activityBoost,
      };
    });

    withFinal.sort((a, b) => b.finalScore - a.finalScore);

    console.log('🔍 Motor — Perfil recebido:', {
      pantrySize,
      commonWeight,
      objectives: healthGoals,
      restrictions: dietProfile,
      activityLevel: profile.activityLevel,
    });
    console.log('🔍 Motor — Top 5 receitas:', withFinal.slice(0, 5).map(r => ({
      title: r.title,
      pantryScore: r.pantryScore.toFixed(1) + '%',
      goalOverlap: r.goalOverlap,
      inflammation: r.inflammationScore,
      commonWeighted: r.commonWeighted.toFixed(1),
      complexity: r.complexityBonus.toFixed(1),
      diversity: r.diversityScore + ' (' + r.diversityCategories.join(', ') + ')',
      activityBoost: r.activityBoost,
      finalScore: r.finalScore.toFixed(1),
    })));

    // Controlled randomization among top 3 if scores are close
    let selected: typeof withFinal[0] | undefined;
    const top3 = withFinal.slice(0, 3);
    if (top3.length >= 3 && (top3[0].finalScore - top3[2].finalScore) <= 5) {
      const randomIndex = Math.floor(Math.random() * 3);
      selected = top3[randomIndex];
      console.log('🎲 Randomização ativada — scores próximos, escolhendo index', randomIndex);
    }

    // Meal-time preference within top 5 (if no randomization)
    if (!selected) {
      const hour = new Date().getHours();
      let mealType = 'Jantar';
      if (hour < 10) mealType = 'Café da Manhã';
      else if (hour < 12) mealType = 'Lanche da Manhã';
      else if (hour < 15) mealType = 'Almoço';
      else if (hour < 18) mealType = 'Lanche da Tarde';

      const top5 = withFinal.slice(0, 5);
      selected = top5.find(r => r.tipo_refeicao?.includes(mealType)) || withFinal[0];
    }

    console.log('🏆 Receita vencedora:', selected.title, '| finalScore:', selected.finalScore.toFixed(1),
      '| breakdown: pantry', selected.pantryScore.toFixed(1), '× 2 + goals', selected.goalOverlap,
      '× 10 + inflam', selected.inflammationScore, '× 5 + common', selected.commonWeighted.toFixed(1), '× 3',
      '+ complexity', selected.complexityBonus.toFixed(1), '+ diversity', selected.diversityScore,
      '(' + selected.diversityCategories.join(', ') + ') + activityBoost', selected.activityBoost);

    return selected;
  } catch (err) {
    console.error('Erro no Motor de Decisão:', err);
    return null;
  }
};
