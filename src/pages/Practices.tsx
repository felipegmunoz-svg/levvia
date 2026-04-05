import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ExerciseCard from "@/components/ExerciseCard";
import RecipeCard from "@/components/RecipeCard";
import ExerciseDetail from "@/components/ExerciseDetail";
import RecipeDetail from "@/components/RecipeDetail";
import BottomNav from "@/components/BottomNav";
import { useProfile } from "@/hooks/useProfile";
import type { Exercise } from "@/data/exercises";
import type { Recipe } from "@/data/recipes";
import {
  fetchExercises,
  fetchRecipes,
  filterRecipesForProfile,
  type DbExercise,
  type DbRecipe,
  type UserProfile,
} from "@/lib/profileEngine";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SOS_SITUATIONS = [
  { situation: "pernas_pesadas", icon: "🦵", title: "Pernas Pesadas e Inchadas", description: "Alívio para dias de alto edema" },
  { situation: "dor_intensa", icon: "💥", title: "Dor Intensa", description: "Protocolo gentil para momentos de dor" },
  { situation: "fadiga_extrema", icon: "😴", title: "Fadiga Extrema", description: "Exercícios mínimos para dias sem energia" },
  { situation: "ansiedade", icon: "🧘", title: "Ansiedade ou Estresse", description: "Respiração e movimento para acalmar" },
  { situation: "rigidez_matinal", icon: "🌅", title: "Rigidez Matinal", description: "Despertar o corpo com suavidade" },
];

// Convert DB types to view types
function toExerciseView(ex: DbExercise): Exercise {
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

function toRecipeView(rec: DbRecipe): Recipe {
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

/** Filter exercises based on pain level */
const painToLevels: Record<string, string[]> = {
  "Sem dor": ["Muito Fácil", "Fácil", "Moderado"],
  "Dor leve": ["Muito Fácil", "Fácil", "Moderado"],
  "Dor moderada": ["Muito Fácil", "Fácil"],
  "Dor intensa": ["Muito Fácil", "Fácil"],
  "Dor muito intensa": ["Muito Fácil"],
};

function filterExercisesForProfile(exercises: DbExercise[], profile: UserProfile): DbExercise[] {
  const allowedLevels = painToLevels[profile.painLevel] || ["Muito Fácil", "Fácil", "Moderado"];
  return exercises.filter((ex) => allowedLevels.includes(ex.level));
}

const Practices = () => {
  const [searchParams] = useSearchParams();
  const { profile, loading: profileLoading } = useProfile();
  const [tab, setTab] = useState<"exercises" | "recipes" | "sos">(
    (searchParams.get("tab") as "exercises" | "recipes" | "sos") || "exercises"
  );
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [mealFilter, setMealFilter] = useState<string | null>(null);
  const [dietFilter, setDietFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const [rawExercises, setRawExercises] = useState<DbExercise[]>([]);
  const [rawRecipes, setRawRecipes] = useState<DbRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Fetch from Supabase
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [exData, recData] = await Promise.all([fetchExercises(), fetchRecipes()]);
      setRawExercises(exData);
      setRawRecipes(recData);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "exercises" || tabParam === "recipes" || tabParam === "sos") {
      setTab(tabParam);
    }
  }, [searchParams]);

  // Personalized filtering
  const personalizedExercises = useMemo(() => {
    if (showAll || profileLoading) return rawExercises;
    return filterExercisesForProfile(rawExercises, profile);
  }, [rawExercises, profile, profileLoading, showAll]);

  const personalizedRecipes = useMemo(() => {
    if (showAll || profileLoading) return rawRecipes;
    return filterRecipesForProfile(rawRecipes, profile);
  }, [rawRecipes, profile, profileLoading, showAll]);

  const exercises = useMemo(() => personalizedExercises.map(toExerciseView), [personalizedExercises]);
  const recipes = useMemo(() => personalizedRecipes.map(toRecipeView), [personalizedRecipes]);

  const allRecipeTags = Array.from(new Set(recipes.flatMap((r) => r.tags)));

  const BODY_REGIONS = [
    { key: "panturrilha", label: "Panturrilha" },
    { key: "tornozelo", label: "Tornozelo" },
    { key: "coxa", label: "Coxa" },
    { key: "quadril", label: "Quadril" },
    { key: "gluteo", label: "Glúteo" },
    { key: "core", label: "Core / Abdômen" },
    { key: "corpo_todo", label: "Corpo Todo" },
    { key: "relaxamento", label: "Relaxamento / Respiração" },
  ];

  const LEVELS = [
    { key: "Muito Fácil", label: "Muito Fácil" },
    { key: "Fácil", label: "Fácil" },
    { key: "Moderado", label: "Moderado" },
  ];

  const filteredExercises = useMemo(() => {
    let result = personalizedExercises;
    if (regionFilter) {
      if (regionFilter === "relaxamento") {
        result = result.filter((e) =>
          e.category?.toLowerCase().includes("relaxamento") ||
          e.category?.toLowerCase().includes("respiração") ||
          e.category?.toLowerCase().includes("respiracao")
        );
      } else {
        result = result.filter((e) =>
          (e.body_part || []).some((bp: string) => bp === regionFilter)
        );
      }
    }
    if (levelFilter) {
      result = result.filter((e) => e.level === levelFilter);
    }
    return result.map(toExerciseView);
  }, [personalizedExercises, regionFilter, levelFilter]);

  const filteredRecipes = useMemo(() => {
    let result = personalizedRecipes;
    if (mealFilter) {
      result = result.filter((r) =>
        (r.tipo_refeicao || []).some((t) => t === mealFilter)
      );
    }
    if (dietFilter) {
      result = result.filter((r) =>
        (r.diet_profile || []).some((d) => d === dietFilter)
      );
    }
    return result.map(toRecipeView);
  }, [personalizedRecipes, mealFilter, dietFilter]);

  if (selectedExercise) {
    return <ExerciseDetail exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />;
  }

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  const currentTags = allExerciseTags;
  const isPersonalized = !showAll && !profileLoading;
  const totalRaw = tab === "exercises" ? rawExercises.length : rawRecipes.length;
  const totalFiltered = tab === "exercises" ? personalizedExercises.length : personalizedRecipes.length;

  const MEAL_TYPES = [
    { key: "Café da Manhã", label: "Café da Manhã", icon: "☕" },
    { key: "Lanche da Manhã", label: "Lanche da Manhã", icon: "🍎" },
    { key: "Almoço", label: "Almoço", icon: "🍽️" },
    { key: "Lanche da Tarde", label: "Lanche da Tarde", icon: "🥤" },
    { key: "Jantar", label: "Jantar", icon: "🌙" },
  ];

  const DIET_TYPES = [
    { key: "vegana", label: "Vegana" },
    { key: "vegetariana", label: "Vegetariana" },
    { key: "onivora", label: "Onívora" },
  ];

  return (
    <div className="min-h-screen bg-background gradient-page pb-24">
      <header className="px-6 pt-10 pb-4">
        <h1 className="text-2xl font-light text-foreground">Práticas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Exercícios e receitas pensados para você
        </p>
      </header>

      {/* Tab switcher — 3 tabs */}
      <div className="px-6 mb-4">
        <div className="flex bg-white/[0.06] border border-white/10 rounded-xl p-1">
          <button
            onClick={() => { setTab("exercises"); setActiveTag(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              tab === "exercises"
                ? "bg-white/[0.12] text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Exercícios ({rawExercises.length})
          </button>
          <button
            onClick={() => { setTab("sos"); setActiveTag(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
              tab === "sos"
                ? "bg-sos/20 text-sos"
                : "text-muted-foreground"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            SOS (5)
          </button>
          <button
            onClick={() => { setTab("recipes"); setActiveTag(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              tab === "recipes"
                ? "bg-white/[0.12] text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Receitas ({rawRecipes.length})
          </button>
        </div>
      </div>

      {/* SOS Mode cards */}
      {tab === "sos" && (
        <main className="px-5 space-y-3 pb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Como você está se sentindo agora?
          </p>
          {SOS_SITUATIONS.map((sos) => (
            <button
              key={sos.situation}
              onClick={() => navigate(`/practices/sos/${sos.situation}`)}
              className="w-full text-left p-4 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-sos/30 hover:bg-sos/5 transition-all min-h-[72px]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sos.icon}</span>
                <div>
                  <p className="font-medium text-foreground text-sm">{sos.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sos.description}</p>
                </div>
              </div>
            </button>
          ))}
        </main>
      )}

      {/* === EXERCISES TAB === */}
      {tab === "exercises" && (
        <>
          {/* Region filter */}
          <div className="px-5 mb-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Região do Corpo</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setRegionFilter(null)}
                className={`flex-shrink-0 text-xs px-3 py-2 rounded-full font-medium transition-all ${
                  !regionFilter
                    ? "bg-secondary text-foreground"
                    : "bg-white/[0.06] text-muted-foreground border border-white/10"
                }`}
              >
                Todas ({personalizedExercises.length})
              </button>
              {BODY_REGIONS.map((region) => {
                const count = personalizedExercises.filter((e) =>
                  region.key === "relaxamento"
                    ? e.category?.toLowerCase().includes("relaxamento") || e.category?.toLowerCase().includes("respiração") || e.category?.toLowerCase().includes("respiracao")
                    : (e.body_part || []).some((bp: string) => bp === region.key)
                ).length;
                if (count === 0) return null;
                return (
                  <button
                    key={region.key}
                    onClick={() => setRegionFilter(regionFilter === region.key ? null : region.key)}
                    className={`flex-shrink-0 text-xs px-3 py-2 rounded-full font-medium transition-all ${
                      regionFilter === region.key
                        ? "bg-secondary text-foreground"
                        : "bg-white/[0.06] text-muted-foreground border border-white/10"
                    }`}
                  >
                    {region.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level filter */}
          <div className="px-5 mb-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Dificuldade</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setLevelFilter(null)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  !levelFilter
                    ? "bg-secondary text-foreground"
                    : "bg-white/[0.06] text-muted-foreground border border-white/10"
                }`}
              >
                Todas
              </button>
              {LEVELS.map((lv) => (
                <button
                  key={lv.key}
                  onClick={() => setLevelFilter(levelFilter === lv.key ? null : lv.key)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    levelFilter === lv.key
                      ? "bg-secondary text-foreground"
                      : "bg-white/[0.06] text-muted-foreground border border-white/10"
                  }`}
                >
                  {lv.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise count */}
          <div className="px-5 mb-3">
            <span className="text-xs text-muted-foreground">
              {filteredExercises.length} exercício{filteredExercises.length !== 1 ? "s" : ""}
              {regionFilter || levelFilter ? " encontrado" + (filteredExercises.length !== 1 ? "s" : "") : ""}
            </span>
          </div>

          {/* Exercise list */}
          <main className="px-5 space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {filteredExercises.map((ex, i) => (
                  <ExerciseCard
                    key={`ex-${i}`}
                    exercise={ex}
                    onClick={() => setSelectedExercise(ex)}
                  />
                ))}
                {filteredExercises.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum exercício encontrado para este filtro.
                  </p>
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* === RECIPES TAB === */}
      {tab === "recipes" && (
        <>
          {/* Meal type filter */}
          <div className="px-5 mb-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Tipo de Refeição</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setMealFilter(null)}
                className={`flex-shrink-0 text-xs px-3 py-2 rounded-full font-medium transition-all ${
                  !mealFilter
                    ? "bg-secondary text-foreground"
                    : "bg-white/[0.06] text-muted-foreground border border-white/10"
                }`}
              >
                Todas
              </button>
              {MEAL_TYPES.map((meal) => (
                <button
                  key={meal.key}
                  onClick={() => setMealFilter(mealFilter === meal.key ? null : meal.key)}
                  className={`flex-shrink-0 text-xs px-3 py-2 rounded-full font-medium transition-all flex items-center gap-1 ${
                    mealFilter === meal.key
                      ? "bg-secondary text-foreground"
                      : "bg-white/[0.06] text-muted-foreground border border-white/10"
                  }`}
                >
                  <span>{meal.icon}</span>
                  {meal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diet filter */}
          <div className="px-5 mb-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Dieta</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDietFilter(null)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  !dietFilter
                    ? "bg-secondary text-foreground"
                    : "bg-white/[0.06] text-muted-foreground border border-white/10"
                }`}
              >
                Todas
              </button>
              {DIET_TYPES.map((diet) => (
                <button
                  key={diet.key}
                  onClick={() => setDietFilter(dietFilter === diet.key ? null : diet.key)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    dietFilter === diet.key
                      ? "bg-secondary text-foreground"
                      : "bg-white/[0.06] text-muted-foreground border border-white/10"
                  }`}
                >
                  {diet.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipe count */}
          <div className="px-5 mb-3">
            <span className="text-xs text-muted-foreground">
              {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? "s" : ""}
              {mealFilter || dietFilter ? " encontrada" + (filteredRecipes.length !== 1 ? "s" : "") : ""}
            </span>
          </div>

          {/* Recipe list */}
          <main className="px-5 space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {filteredRecipes.map((recipe, i) => (
                  <RecipeCard
                    key={`rec-${i}`}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
                {filteredRecipes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma receita encontrada para este filtro.
                  </p>
                )}
              </>
            )}
          </main>
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default Practices;
