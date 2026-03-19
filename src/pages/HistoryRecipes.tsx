import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import RecipeDetail from "@/components/RecipeDetail";
import { useChallengeData, mealSlots } from "@/hooks/useChallengeData";
import { filterRecipesForProfile, type DbRecipe } from "@/lib/profileEngine";

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

const HistoryRecipes = () => {
  const navigate = useNavigate();
  const { currentDay, filteredRecipes } = useChallengeData();
  const [selectedRecipe, setSelectedRecipe] = useState<DbRecipe | null>(null);

  // Collect unique recipes from all unlocked days
  const unlockedRecipes = useMemo(() => {
    const seen = new Set<string>();
    const items: { recipe: DbRecipe; day: number }[] = [];

    for (let day = 1; day <= currentDay; day++) {
      for (const slot of mealSlots) {
        const slotMapping: Record<string, string[]> = {
          "Café da Manhã": ["Café da Manhã"],
          "Lanche da Manhã": ["Lanche da Manhã", "Lanche"],
          "Almoço": ["Almoço"],
          "Lanche da Tarde": ["Lanche da Tarde", "Lanche"],
          "Jantar": ["Jantar"],
        };
        const types = slotMapping[slot];
        const available = filteredRecipes.filter((r) =>
          r.tipo_refeicao?.some((t) => types.some((st) => t === st))
        );
        if (available.length > 0) {
          const idx = (day - 1) % available.length;
          const recipe = available[idx];
          if (!seen.has(recipe.id)) {
            seen.add(recipe.id);
            items.push({ recipe, day });
          }
        }
      }
    }

    return items;
  }, [currentDay, filteredRecipes]);

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
      <header className="gradient-page px-6 pt-10 pb-6 rounded-b-3xl">
        <button onClick={() => navigate("/history")} className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Voltar
        </button>
        <h1 className="text-2xl font-light text-foreground">🍃 Receitas</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {unlockedRecipes.length} receitas desbloqueadas
        </p>
      </header>

      <main className="px-5 mt-6 space-y-3">
        {unlockedRecipes.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ainda não há receitas desbloqueadas. Complete os dias da sua jornada para construir seu histórico.
            </p>
          </div>
        ) : (
          unlockedRecipes.map(({ recipe, day }, i) => (
            <motion.button
              key={recipe.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedRecipe(recipe)}
              className="glass-card p-4 w-full text-left flex items-center gap-3 transition-all hover:border-secondary/30 active:scale-[0.98]"
            >
              <span className="text-2xl">🍃</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{recipe.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Dia {day} da jornada</p>
              </div>
            </motion.button>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default HistoryRecipes;
