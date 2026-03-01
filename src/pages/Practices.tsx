import { useState } from "react";
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
  const [tab, setTab] = useState<"exercises" | "recipes">("exercises");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (selectedExercise) {
    return <ExerciseDetail exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />;
  }

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-10 pb-4">
        <h1 className="text-2xl font-extrabold text-foreground">Práticas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Exercícios e receitas pensados para você
        </p>
      </header>

      {/* Tab switcher */}
      <div className="px-6 mb-5">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setTab("exercises")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              tab === "exercises"
                ? "bg-card text-primary shadow-card"
                : "text-muted-foreground"
            }`}
          >
            Exercícios
          </button>
          <button
            onClick={() => setTab("recipes")}
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

      <main className="px-5 space-y-3">
        {tab === "exercises"
          ? exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onClick={() => setSelectedExercise(ex)}
              />
            ))
          : recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Practices;
