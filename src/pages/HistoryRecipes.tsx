import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import RecipeDetail from "@/components/RecipeDetail";
import { useChallengeData } from "@/hooks/useChallengeData";
import type { DbRecipe } from "@/lib/profileEngine";

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

const SLOT_LABELS: Record<string, string> = {
  morning: "Manhã",
  lunch: "Almoço",
  afternoon: "Lanche",
  night: "Jantar",
};

const HistoryRecipes = () => {
  const navigate = useNavigate();
  const { currentDay, filteredRecipes, challengeProgress } = useChallengeData();
  const [selectedRecipe, setSelectedRecipe] = useState<DbRecipe | null>(null);

  const servedRecipes = useMemo(() => {
    const items: { recipe: DbRecipe; day: number; slotLabel: string }[] = [];
    const seen = new Set<string>();

    for (let day = currentDay; day >= 1; day--) {
      const dayTp = (challengeProgress as any)?.touchpoints?.[`day${day}`];
      if (!dayTp) continue;

      for (const slotKey of ["morning", "lunch", "afternoon", "night"] as const) {
        const slot = dayTp[slotKey];
        if (!slot?.done) continue;

        // Backward compat: check both top-level and .diary (old format)
        const recipeId =
          slot.recipe_choice_id ??
          slot.snack_id ??
          (slot.diary as any)?.recipe_choice_id ??
          (slot.diary as any)?.snack_id;

        if (!recipeId) continue;

        const uniqueKey = `${day}-${slotKey}-${recipeId}`;
        if (seen.has(uniqueKey)) continue;
        seen.add(uniqueKey);

        const recipe = filteredRecipes.find((r) => r.id === recipeId);
        if (recipe) {
          items.push({ recipe, day, slotLabel: SLOT_LABELS[slotKey] ?? slotKey });
        }
      }
    }

    return items;
  }, [currentDay, challengeProgress, filteredRecipes]);

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={toRecipeView(selectedRecipe)}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-6">
        <button onClick={() => navigate("/history")} className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <h1 className="text-xl font-heading font-bold text-foreground">🍃 Receitas que fiz</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {servedRecipes.length} receita{servedRecipes.length !== 1 ? "s" : ""} registrada{servedRecipes.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {servedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              As receitas que você preparar aparecerão aqui, com o dia da jornada em que foram feitas.
            </p>
          </div>
        ) : (
          servedRecipes.map(({ recipe, day, slotLabel }, i) => (
            <motion.button
              key={`${recipe.id}-${day}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedRecipe(recipe)}
              className="glass-card p-4 w-full text-left flex items-center gap-3 transition-all hover:border-secondary/30 active:scale-[0.98]"
            >
              <span className="text-2xl">🍃</span>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-foreground text-sm truncate">{recipe.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dia {day} · {slotLabel}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Ver →</span>
            </motion.button>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default HistoryRecipes;
