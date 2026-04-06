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
  nutrient_density_score: number | null;
  food_categories: string[] | null;
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
    dietaryRestrictions: ((onb.raw as any)?.['13'] as string[]) || (onb.restrictions as string[]) || [],
    dietaryPreferences: ((onb.raw as any)?.['14'] as string[]) || (onb.preferences as string[]) || [],
    inflammatoryEnemies: ((onb.raw as any)?.['11'] as string[]) || (onb.enemies as string[]) || [],
    antiInflammatoryAllies: ((onb.raw as any)?.['12'] as string[]) || (onb.allies as string[]) || [],
    pantryItems: (data as any).pantry_items || [],
    avatarUrl: (data as any).avatar_url || null,
    heatMapDay1: (() => {
      const raw = (data as any).heat_map_day1;
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
      // Filter out non-numeric keys like created_at
      const filtered: Record<string, number> = {};
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'number') filtered[k] = v;
      }
      return Object.keys(filtered).length > 0 ? filtered : {};
    })(),
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

  // Normalise restrictions — accept any capitalisation or variant spelling
  const normRestr = (profile.dietaryRestrictions || []).map(r => r.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  // Dietary restrictions
  if (normRestr.some(r => r.includes("vegan"))) {
    filtered = filtered.filter((r) => {
      const dp = (r.diet_profile || []).map(d => d.toLowerCase());
      const tags = (r.tags || []).map(t => t.toLowerCase());
      return dp.some(d => d.includes("vegan")) ||
             tags.some(t => t.includes("vegan"));
    });
  } else if (normRestr.some(r => r.includes("vegetar"))) {
    filtered = filtered.filter((r) => {
      const dp = (r.diet_profile || []).map(d => d.toLowerCase());
      const tags = (r.tags || []).map(t => t.toLowerCase());
      return dp.some(d => d.includes("vegetar") || d.includes("vegan")) ||
             tags.some(t => t.includes("vegetar") || t.includes("vegan"));
    });
  }
  if (normRestr.some(r => r.includes("glut") || r.includes("gluten"))) {
    filtered = filtered.filter((r) => {
      const af = (r.allergen_free || []).map(a => a.toLowerCase());
      return af.some(a => a.includes("glut")) ||
             (r.tags || []).some(t => t.toLowerCase().includes("glúten") || t.toLowerCase().includes("gluten"));
    });
  }
  if (normRestr.some(r => r.includes("lactos"))) {
    filtered = filtered.filter((r) => {
      const af = (r.allergen_free || []).map(a => a.toLowerCase());
      return af.some(a => a.includes("lactos")) ||
             (r.tags || []).some(t => t.toLowerCase().includes("lactose"));
    });
  }
  if (normRestr.some(r => r.includes("fruto") || r.includes("mar") || r.includes("seafood"))) {
    filtered = filtered.filter((r) =>
      !r.ingredients.some((i) => /salmão|peixe|tilápia|atum|sardinha|camarão|frutos do mar/i.test(i))
    );
  }
  if (normRestr.some(r => r.includes("amendoim") || r.includes("peanut"))) {
    filtered = filtered.filter((r) => !r.ingredients.some((i) => /amendoim/i.test(i)));
  }
  if (normRestr.some(r => r.includes("oleaginosa") || r.includes("nuts") || r.includes("castanha"))) {
    filtered = filtered.filter((r) =>
      !r.ingredients.some((i) => /nozes|castanha|amêndoa|amendoa|pistache|avelã/i.test(i))
    );
  }
  if (normRestr.some(r => r.includes("soja") || r.includes("soy"))) {
    filtered = filtered.filter((r) =>
      !r.ingredients.some((i) =>
        /soja|tofu|edamame|proteína texturizada|leite de soja|shoyu|missô|miso/i.test(i)
      )
    );
  }

  // Dietary preferences
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
    const pantryLower = profile.pantryItems.map((p) => normAccent(p.toLowerCase()));
    filtered.sort((a, b) => {
      const scoreA = scorePantryMatch(a, pantryLower);
      const scoreB = scorePantryMatch(b, pantryLower);
      return scoreB - scoreA; // higher match first
    });
  }

  return filtered;
}

function normAccent(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function scorePantryMatch(recipe: DbRecipe, pantryLower: string[]): number {
  if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;
  let matches = 0;
  for (const ing of recipe.ingredients) {
    const ingNorm = normAccent(ing.toLowerCase());
    for (const p of pantryLower) {
      const pNorm = normAccent(p);
      if (ingNorm.includes(pNorm) || pNorm.includes(ingNorm.split(" ")[0])) {
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



    // Controlled randomization among top 3 if scores are close
    let selected: typeof withFinal[0] | undefined;
    const top3 = withFinal.slice(0, 3);
    if (top3.length >= 3 && (top3[0].finalScore - top3[2].finalScore) <= 5) {
      const randomIndex = Math.floor(Math.random() * 3);
      selected = top3[randomIndex];
      
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
      selected = top5.find(r => r.tipo_refeicao?.some(t => t.toLowerCase() === mealType.toLowerCase())) || withFinal[0];
    }



    return selected;
  } catch (err) {
    console.error('Erro no Motor de Decisão:', err);
    return null;
  }
};

// ─── Touchpoint-aware selection functions ───

const MORNING_CATEGORIES = [
  "Respiração e Relaxamento",
  "Drenagem Linfática Manual",
  "Movimento Articular Suave",
];

function scoreForTouchpoint(exercise: DbExercise, profile: UserProfile): number {
  let score = 0;
  // body_part match with affectedAreas
  if (exercise.body_part?.length && profile.affectedAreas?.length) {
    for (const part of exercise.body_part) {
      if (profile.affectedAreas.some(a => part.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(part.toLowerCase()))) {
        score += 10;
      }
    }
  }
  // clinical_benefit match with healthConditions
  if (exercise.clinical_benefit && profile.healthConditions?.length) {
    for (const cond of profile.healthConditions) {
      if (exercise.clinical_benefit.toLowerCase().includes(cond.toLowerCase())) {
        score += 5;
      }
    }
  }
  return score;
}

export function selectMorningExercise(
  filteredExercises: DbExercise[],
  profile: UserProfile,
  dayNumber: number,
  rescueMode: string = "neutral"
): DbExercise | null {
  if (!filteredExercises?.length) return null;

  let categories = [...MORNING_CATEGORIES];
  if (rescueMode === "resgate") {
    categories = ["Drenagem Linfática Manual", "Respiração e Relaxamento"];
  } else if (rescueMode === "consagracao") {
    categories = [...MORNING_CATEGORIES, "Fortalecimento Leve", "Caminhada e Movimento Funcional"];
  }

  let candidates = filteredExercises.filter(e =>
    categories.some(cat => cat.toLowerCase() === (e.category || '').toLowerCase())
  );

  // Fallback: if no morning-specific category matches, use all exercises
  if (candidates.length === 0) candidates = [...filteredExercises];

  // Prefer short exercises (rescue mode allows longer)
  const durationCap = rescueMode === "resgate" ? 600 : 300;
  if (candidates.length > 1) {
    const short = candidates.filter(e =>
      (e.duration_seconds != null && e.duration_seconds <= durationCap) ||
      (rescueMode === "resgate" ? /\d+\s*min/i.test(e.duration || "") : /[35]\s*min/i.test(e.duration || ""))
    );
    if (short.length > 0) candidates = short;
  }

  // High pain: only pain_suitability >= 4
  if (isHighPain(profile.painLevel)) {
    const suitable = candidates.filter(e =>
      e.pain_suitability == null || e.pain_suitability >= 4
    );
    if (suitable.length > 0) candidates = suitable;
  }

  if (candidates.length === 0) return null;

  // Score and sort
  const scored = candidates
    .map(e => {
      let score = scoreForTouchpoint(e, profile);
      if (rescueMode === "resgate" && e.pain_suitability != null && e.pain_suitability >= 8) {
        score += 20;
      }
      return { e, score };
    })
    .sort((a, b) => b.score - a.score);

  const idx = (dayNumber - 1) % scored.length;
  return scored[idx].e;
}

export function selectShotRecipe(
  filteredRecipes: DbRecipe[],
  profile: UserProfile,
  dayNumber: number,
  rescueMode: string = "neutral"
): DbRecipe | null {
  if (!filteredRecipes?.length) return null;

  let candidates = filteredRecipes.filter(r =>
    r.tipo_refeicao?.some(t => /bebida/i.test(t)) ||
    r.tags?.some(t => /shot/i.test(t)) ||
    /bebida|shot/i.test(r.category || "")
  );

  // Fallback: broader match for snack/lanche/bebida types
  if (candidates.length === 0) {
    candidates = filteredRecipes.filter(r =>
      r.tipo_refeicao?.some(t => /lanche|bebida|snack/i.test(t)) || false
    );
  }

  if (candidates.length === 0) return null;

  // Score
  const scored = candidates.map(r => {
    let score = (r.inflammation_score ?? 0) * 10;
    score += (r.nutrient_density_score ?? 0) * 2;
    if (rescueMode === "resgate" && (r.inflammation_score ?? 0) >= 9) {
      score += 30;
    }
    // health_goals overlap
    if (r.health_goals?.length && profile.objectives?.length) {
      for (const g of r.health_goals) {
        if (profile.objectives.some(o => o.toLowerCase().includes(g.toLowerCase()))) {
          score += 10;
        }
      }
    }
    // High pain: prefer simpler
    if (isHighPain(profile.painLevel) && r.pantry_complexity) {
      if (r.pantry_complexity.toLowerCase() === 'simples') score += 5;
      if (r.pantry_complexity.toLowerCase() === 'complexa') score -= 5;
    }
    return { r, score };
  }).sort((a, b) => b.score - a.score);

  const idx = (dayNumber - 1) % scored.length;
  return scored[idx].r;
}

export function selectMicroMovement(
  filteredExercises: DbExercise[],
  profile: UserProfile,
  dayNumber: number,
  excludeId?: string,
  rescueMode: string = "neutral"
): DbExercise | null {
  if (!filteredExercises?.length) return null;

  let microCategories = ["Movimento Articular Suave", "Drenagem Linfática Manual"];
  if (rescueMode === "consagracao") {
    microCategories = [...microCategories, "Fortalecimento Leve"];
  }

  const durationCap = rescueMode === "resgate" ? 600 : 120;
  const durationRegex = rescueMode === "resgate" ? /\d+\s*min/i : /[12]\s*min/i;

  let candidates = filteredExercises.filter(e => {
    if (excludeId && e.id === excludeId) return false;
    const isShort = (e.duration_seconds != null && e.duration_seconds <= durationCap) ||
      durationRegex.test(e.duration || "");
    const isCategory = microCategories.some(cat => cat.toLowerCase() === (e.category || '').toLowerCase());
    return isShort || isCategory;
  });

  if (excludeId) {
    candidates = candidates.filter(e => e.id !== excludeId);
  }

  // Fallback: any exercise except the morning one
  if (candidates.length === 0) {
    candidates = filteredExercises.filter(e => e.id !== excludeId);
  }

  if (candidates.length === 0) return null;

  // Score: prefer accessible environments + affected areas
  const scored = candidates.map(e => {
    let score = scoreForTouchpoint(e, profile);
    if (e.environment?.some(env => /cama|cadeira|sof[aá]/i.test(env))) {
      score += 5;
    }
    if (rescueMode === "resgate") {
      if ((e.category || '').toLowerCase() === 'drenagem linfática manual') score += 20;
      // Extra boost for body_part match in rescue
      if (e.body_part?.length && profile.affectedAreas?.length) {
        for (const area of profile.affectedAreas) {
          if (e.body_part.some(bp => bp.toLowerCase().includes(area.toLowerCase()))) {
            score += 10; // additional on top of scoreForTouchpoint
          }
        }
      }
    }
    return { e, score };
  }).sort((a, b) => b.score - a.score);

  const idx = ((dayNumber - 1) + 7) % scored.length;
  return scored[idx].e;
}

export function selectSnackRecipe(
  filteredRecipes: DbRecipe[],
  profile: UserProfile,
  dayNumber: number,
  rescueMode: string = "neutral"
): DbRecipe | null {
  if (!filteredRecipes?.length) return null;

  let candidates = filteredRecipes.filter(r =>
    r.tipo_refeicao?.some(t => /lanche/i.test(t)) ||
    /lanche|snack/i.test(r.category || "")
  );

  // Fallback: any recipe that's not strictly almoço/jantar
  if (candidates.length === 0) {
    candidates = filteredRecipes.filter(r =>
      !r.tipo_refeicao?.some(t => /almo[çc]o|jantar/i.test(t))
    );
  }

  if (candidates.length === 0) return null;

  const scored = candidates.map(r => {
    let score = (r.inflammation_score ?? 0) * 5;
    score += (r.common_pantry_match ?? 0) * 3;
    if (rescueMode === "resgate" && (r.inflammation_score ?? 0) >= 9) {
      score += 20;
    }
    return { r, score };
  }).sort((a, b) => b.score - a.score);

  const idx = (dayNumber - 1) % scored.length;
  return scored[idx].r;
}

export function selectLunchRecipes(
  filteredRecipes: DbRecipe[],
  profile: UserProfile,
  dayNumber: number,
  rescueMode: string = "neutral"
): DbRecipe[] {
  if (!filteredRecipes?.length) return [];

  let candidates = filteredRecipes.filter(r =>
    r.tipo_refeicao?.some(t => /almo[çc]o/i.test(t)) ||
    /almo[çc]o/i.test(r.category || "")
  );

  // Rescue mode: hard-filter for high anti-inflammatory
  if (rescueMode === "resgate" && candidates.length > 0) {
    const highAnti = candidates.filter(r => (r.inflammation_score ?? 0) >= 8);
    if (highAnti.length >= 3) {
      candidates = highAnti;
    } else {
      const medAnti = candidates.filter(r => (r.inflammation_score ?? 0) >= 6);
      if (medAnti.length >= 3) candidates = medAnti;
    }
  }

  // Fallback: use all available recipes
  if (candidates.length === 0) candidates = [...filteredRecipes];

  if (candidates.length === 0) return [];

  const scored = candidates.map(r => {
    let score = (r.inflammation_score ?? 0) * 5;
    score += (r.nutrient_density_score ?? 0) * 5;
    // health_goals overlap
    if (r.health_goals?.length && profile.objectives?.length) {
      for (const g of r.health_goals) {
        if (profile.objectives.some(o => o.toLowerCase().includes(g.toLowerCase()))) {
          score += 10;
        }
      }
    }
    score += (r.common_pantry_match ?? 0) * 3;
    // Rescue: boost top anti-inflammatory
    if (rescueMode === "resgate" && (r.inflammation_score ?? 0) === 10) {
      score += 30;
    }
    // Consecration: boost energy/satiety goals
    if (rescueMode === "consagracao" && r.health_goals?.length) {
      if (r.health_goals.some(g => /energia|saciedade/i.test(g))) {
        score += 10;
      }
    }
    return { r, score };
  }).sort((a, b) => b.score - a.score);

  // Day-based window for top 3
  const startIdx = ((dayNumber - 1) * 3) % scored.length;
  const result: DbRecipe[] = [];
  for (let i = 0; i < 3 && i < scored.length; i++) {
    const idx = (startIdx + i) % scored.length;
    result.push(scored[idx].r);
  }
  return result;
}
