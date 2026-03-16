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
import { Sparkles } from "lucide-react";

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
  const [tab, setTab] = useState<"exercises" | "recipes">(
    (searchParams.get("tab") as "exercises" | "recipes") || "exercises"
  );
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
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
    if (tabParam === "exercises" || tabParam === "recipes") {
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

  const allExerciseTags = Array.from(new Set(exercises.flatMap((e) => [e.category, e.level])));
  const allRecipeTags = Array.from(new Set(recipes.flatMap((r) => r.tags)));

  const filteredExercises = activeTag
    ? exercises.filter((e) => e.category === activeTag || e.level === activeTag)
    : exercises;

  const filteredRecipes = activeTag
    ? recipes.filter((r) => r.tags.includes(activeTag) || r.category === activeTag)
    : recipes;

  if (selectedExercise) {
    return <ExerciseDetail exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />;
  }

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  const currentTags = tab === "exercises" ? allExerciseTags : allRecipeTags;
  const isPersonalized = !showAll && !profileLoading;
  const totalRaw = tab === "exercises" ? rawExercises.length : rawRecipes.length;
  const totalFiltered = tab === "exercises" ? personalizedExercises.length : personalizedRecipes.length;

  return (
    <div className="min-h-screen bg-background gradient-page pb-24">
      <header className="px-6 pt-10 pb-4">
        <h1 className="text-2xl font-light text-foreground">Práticas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Exercícios e receitas pensados para você
        </p>
      </header>

      {/* Tab switcher */}
      <div className="px-6 mb-4">
        <div className="flex bg-white/[0.06] border border-white/10 rounded-xl p-1">
          <button
            onClick={() => { setTab("exercises"); setActiveTag(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === "exercises"
                ? "bg-white/[0.12] text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Exercícios
          </button>
          <button
            onClick={() => { setTab("recipes"); setActiveTag(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === "recipes"
                ? "bg-white/[0.12] text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Receitas
          </button>
        </div>
      </div>

      {/* Personalization indicator */}
      {!loading && !profileLoading && (
        <div className="px-5 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPersonalized && (
                <Badge variant="secondary" className="bg-secondary/20 text-secondary border-0 text-xs gap-1">
                  <Sparkles size={10} />
                  Personalizado
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {isPersonalized && totalFiltered < totalRaw
                  ? `${totalFiltered} de ${totalRaw} para seu perfil`
                  : `${totalRaw} disponíveis`}
              </span>
            </div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-secondary hover:underline"
            >
              {showAll ? "Personalizar" : "Ver todos"}
            </button>
          </div>
        </div>
      )}

      {/* Tag filters */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTag(null)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              !activeTag
                ? "bg-secondary text-foreground"
                : "bg-white/[0.06] text-muted-foreground border border-white/10"
            }`}
          >
            Todos
          </button>
          {currentTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                activeTag === tag
                  ? "bg-secondary text-foreground"
                  : "bg-white/[0.06] text-muted-foreground border border-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === "exercises" ? (
          filteredExercises.map((ex, i) => (
            <ExerciseCard
              key={`ex-${i}`}
              exercise={ex}
              onClick={() => setSelectedExercise(ex)}
            />
          ))
        ) : (
          filteredRecipes.map((recipe, i) => (
            <RecipeCard
              key={`rec-${i}`}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))
        )}
        {!loading &&
          ((tab === "exercises" && filteredExercises.length === 0) ||
            (tab === "recipes" && filteredRecipes.length === 0)) && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum resultado encontrado para este filtro.
            </p>
          )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Practices;
