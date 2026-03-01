import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { exercises } from "@/data/exercises";
import { recipes } from "@/data/recipes";
import ExerciseCard from "@/components/ExerciseCard";
import RecipeCard from "@/components/RecipeCard";
import ExerciseDetail from "@/components/ExerciseDetail";
import RecipeDetail from "@/components/RecipeDetail";
import BottomNav from "@/components/BottomNav";
import type { Exercise } from "@/data/exercises";
import type { Recipe } from "@/data/recipes";

const Practices = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<"exercises" | "recipes">(
    (searchParams.get("tab") as "exercises" | "recipes") || "exercises"
  );
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Handle deep link from Today page
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const highlightId = searchParams.get("highlight");
    if (tabParam === "exercises" || tabParam === "recipes") {
      setTab(tabParam);
    }
    if (highlightId) {
      const id = parseInt(highlightId);
      if (tabParam === "exercises") {
        const ex = exercises.find((e) => e.id === id);
        if (ex) setSelectedExercise(ex);
      } else if (tabParam === "recipes") {
        const rec = recipes.find((r) => r.id === id);
        if (rec) setSelectedRecipe(rec);
      }
    }
  }, [searchParams]);

  // Collect all tags
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-10 pb-4">
        <h1 className="text-2xl font-extrabold text-foreground">Práticas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Exercícios e receitas pensados para você
        </p>
      </header>

      {/* Tab switcher */}
      <div className="px-6 mb-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => { setTab("exercises"); setActiveTag(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              tab === "exercises"
                ? "bg-card text-primary shadow-card"
                : "text-muted-foreground"
            }`}
          >
            Exercícios
          </button>
          <button
            onClick={() => { setTab("recipes"); setActiveTag(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              tab === "recipes"
                ? "bg-card text-primary shadow-card"
                : "text-muted-foreground"
            }`}
          >
            Receitas
          </button>
        </div>
      </div>

      {/* Tag filters */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTag(null)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
              !activeTag
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Todos
          </button>
          {currentTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                activeTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 space-y-3">
        {tab === "exercises"
          ? filteredExercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onClick={() => setSelectedExercise(ex)}
              />
            ))
          : filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
        {((tab === "exercises" && filteredExercises.length === 0) ||
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
