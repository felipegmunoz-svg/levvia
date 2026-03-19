import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { fetchRecipes, filterRecipesForProfile, type DbRecipe, type UserProfile } from "@/lib/profileEngine";
import RecipeDetail from "@/components/RecipeDetail";

interface Day1MealSuggestionProps {
  profile: UserProfile;
  onNext: () => void;
}

type MealSlot = "Café da Manhã" | "Lanche da Manhã" | "Almoço" | "Lanche da Tarde" | "Jantar";

function getMealSlot(): { slot: MealSlot; label: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return { slot: "Café da Manhã", label: "Café da Manhã" };
  if (hour >= 10 && hour < 12) return { slot: "Lanche da Manhã", label: "Lanche da Manhã" };
  if (hour >= 12 && hour < 15) return { slot: "Almoço", label: "Almoço" };
  if (hour >= 15 && hour < 18) return { slot: "Lanche da Tarde", label: "Lanche da Tarde" };
  return { slot: "Jantar", label: "Jantar" };
}

function getRecipesForSlot(recipes: DbRecipe[], slot: MealSlot): DbRecipe[] {
  const mapping: Record<MealSlot, string[]> = {
    "Café da Manhã": ["Café da Manhã"],
    "Lanche da Manhã": ["Lanche da Manhã", "Lanche"],
    "Almoço": ["Almoço"],
    "Lanche da Tarde": ["Lanche da Tarde", "Lanche"],
    "Jantar": ["Jantar"],
  };
  const types = mapping[slot];
  return recipes.filter((r) => r.tipo_refeicao?.some((t) => types.includes(t)));
}

const Day1MealSuggestion = ({ profile, onNext }: Day1MealSuggestionProps) => {
  const [recipes, setRecipes] = useState<DbRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecipe, setShowRecipe] = useState(false);

  const { slot, label } = useMemo(() => getMealSlot(), []);

  useEffect(() => {
    fetchRecipes().then((data) => {
      setRecipes(data);
      setLoading(false);
    });
  }, []);

  const suggestedRecipe = useMemo(() => {
    const filtered = filterRecipesForProfile(recipes, profile);
    const slotRecipes = getRecipesForSlot(filtered, slot);
    return slotRecipes.length > 0 ? slotRecipes[0] : filtered[0] || null;
  }, [recipes, profile, slot]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showRecipe && suggestedRecipe) {
    return (
      <RecipeDetail
        recipe={{
          id: 0,
          title: suggestedRecipe.title,
          tipo_refeicao: suggestedRecipe.tipo_refeicao || [],
          tags: suggestedRecipe.tags || [],
          ingredients: suggestedRecipe.ingredients || [],
          instructions: suggestedRecipe.instructions || [],
          por_que_resfria: suggestedRecipe.por_que_resfria || "",
          dica: suggestedRecipe.dica || "",
          category: suggestedRecipe.category,
          time: suggestedRecipe.time || "",
          servings: suggestedRecipe.servings || "",
          description: suggestedRecipe.description || "",
          icon: suggestedRecipe.icon || "utensils",
        }}
        }}
        onBack={() => setShowRecipe(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-12">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-secondary text-center mb-4 tracking-[0.2em]"
        style={{ fontWeight: 500, fontSize: "0.75rem" }}
      >
        SUA PRIMEIRA ESCOLHA CONSCIENTE
      </motion.p>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-foreground text-center mb-2"
        style={{ fontWeight: 400, fontSize: "1.2rem" }}
      >
        Sua Refeição de Resfriamento
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-foreground/60 text-center mb-8 max-w-sm"
        style={{ fontWeight: 300, fontSize: "0.9rem" }}
      >
        Para o seu {label} de hoje, o Levvia sugere uma Refeição de Resfriamento
        que vai começar a acalmar seu corpo.
      </motion.p>

      {/* Recipe Card */}
      {suggestedRecipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-5 w-full max-w-sm mb-6"
        >
          {(suggestedRecipe as any).image_url && (
            <img
              src={(suggestedRecipe as any).image_url}
              alt={suggestedRecipe.title}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
          )}
          <h3 className="text-foreground font-medium text-base mb-2">
            {suggestedRecipe.title}
          </h3>
          {suggestedRecipe.por_que_resfria && (
            <p
              className="text-foreground/60 italic leading-relaxed mb-4"
              style={{ fontWeight: 300, fontSize: "0.85rem" }}
            >
              {suggestedRecipe.por_que_resfria}
            </p>
          )}

          <button
            onClick={() => setShowRecipe(true)}
            className="w-full py-3 rounded-2xl border border-secondary/30 text-secondary text-sm font-medium hover:bg-secondary/10 transition-colors"
          >
            Ver Receita Completa →
          </button>
        </motion.div>
      )}

      {!suggestedRecipe && (
        <div className="glass-card p-5 w-full max-w-sm mb-6">
          <p className="text-foreground/60 text-center text-sm">
            Nenhuma receita disponível para este horário ainda.
          </p>
        </div>
      )}

      {/* Bottom text */}
      <p
        className="text-foreground/50 text-center italic mb-8 max-w-xs"
        style={{ fontWeight: 300, fontSize: "0.85rem" }}
      >
        Sinta a diferença que uma escolha consciente faz. Amanhã, vamos registrar
        como você se sentiu.
      </p>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
      >
        Registrar meu Dia 1 →
      </button>
    </div>
  );
};

export default Day1MealSuggestion;
