import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { selectDay1Recipe, type DbRecipe, type UserProfile } from "@/lib/profileEngine";
import RecipeDetail from "@/components/RecipeDetail";

interface Day2MealSuggestionProps {
  profile: UserProfile;
  onNext: () => void;
}

const SPECIFIC_RECIPE_ID = "7c79304e-17d5-4456-bc81-43501e5f8e36";

function getMealLabel(): string {
  const hour = new Date().getHours();
  if (hour < 10) return "Café da Manhã";
  if (hour < 12) return "Lanche da Manhã";
  if (hour < 15) return "Almoço";
  if (hour < 18) return "Lanche da Tarde";
  if (hour < 21) return "Jantar";
  return "Café da Manhã";
}

const Day2MealSuggestion = ({ profile, onNext }: Day2MealSuggestionProps) => {
  const [recipe, setRecipe] = useState<DbRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const hasExecuted = useRef(false);
  const label = useMemo(() => getMealLabel(), []);

  const loadRecipe = async () => {
    setLoading(true);
    setFetchError(false);

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // Try specific recipe first
        const { data: specific, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("id", SPECIFIC_RECIPE_ID)
          .eq("is_active", true)
          .maybeSingle();

        if (!error && specific && specific.ingredients?.length && specific.instructions?.length) {
          console.log("✅ Receita Dia 2 (específica):", specific.title);
          setRecipe(specific as unknown as DbRecipe);
          setLoading(false);
          return;
        }

        // Fallback to decision engine
        console.log("⚠️ Receita específica não encontrada, usando motor de decisão");
        const fallback = await selectDay1Recipe(profile);
        console.log("🍽️ Receita Dia 2 (fallback):", fallback?.title || "NENHUMA");
        setRecipe(fallback);
        setLoading(false);
        return;
      } catch (err) {
        console.error(`❌ Tentativa ${attempt + 1}/3 falhou:`, err);
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    // All retries failed
    setFetchError(true);
    setLoading(false);
  };

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;
    loadRecipe();
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showRecipe && recipe) {
    return (
      <RecipeDetail
        recipe={{
          id: 0,
          title: recipe.title,
          tipo_refeicao: recipe.tipo_refeicao || [],
          tags: recipe.tags || [],
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          por_que_resfria: recipe.por_que_resfria || "",
          dica: recipe.dica || "",
          category: recipe.category,
          time: recipe.time || "",
          servings: recipe.servings || "",
          description: recipe.description || "",
          icon: recipe.icon || "utensils",
          image_url: recipe.image_url || undefined,
        }}
        onBack={() => setShowRecipe(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-12">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-secondary text-center mb-4 tracking-[0.2em]"
        style={{ fontWeight: 500, fontSize: "0.75rem" }}
      >
        ALIMENTOS QUE RESFRIAM
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-foreground text-center mb-2"
        style={{ fontWeight: 400, fontSize: "1.2rem" }}
      >
        🍽️ Sua Refeição Anti-inflamatória
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-foreground/60 text-center mb-8 max-w-sm"
        style={{ fontWeight: 300, fontSize: "0.9rem" }}
      >
        Para o seu {label}, uma receita rica em nutrientes que ajudam a "resfriar"
        seu corpo de dentro para fora.
      </motion.p>

      {fetchError && (
        <div className="glass-card p-5 w-full max-w-sm mb-6 text-center">
          <p className="text-foreground/60 text-sm mb-3">
            Não conseguimos carregar a receita. Verifique sua conexão.
          </p>
          <button
            onClick={() => {
              hasExecuted.current = false;
              loadRecipe();
            }}
            className="py-2 px-6 rounded-2xl border border-secondary/30 text-secondary text-sm font-medium hover:bg-secondary/10 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!fetchError && recipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-5 w-full max-w-sm mb-6"
        >
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
          )}
          <h3 className="text-foreground font-medium text-base mb-2">{recipe.title}</h3>

          <div className="glass-card p-4 mb-4">
            <p className="text-secondary text-xs font-medium mb-1">💡 Por que esta receita?</p>
            <p className="text-foreground/60 text-sm leading-relaxed" style={{ fontWeight: 300 }}>
              {recipe.por_que_resfria ||
                "Rica em nutrientes anti-inflamatórios, ela fornece energia sustentável sem agravar a inflamação."}
            </p>
          </div>

          <button
            onClick={() => setShowRecipe(true)}
            className="w-full py-3 rounded-2xl border border-secondary/30 text-secondary text-sm font-medium hover:bg-secondary/10 transition-colors"
          >
            Ver Receita Completa →
          </button>
        </motion.div>
      )}

      {!fetchError && !recipe && (
        <div className="glass-card p-5 w-full max-w-sm mb-6">
          <p className="text-foreground/60 text-center text-sm">
            Não encontramos uma receita perfeita para hoje. Que tal explorar nossas opções no cardápio?
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
      >
        Continuar →
      </button>
    </div>
  );
};

export default Day2MealSuggestion;
