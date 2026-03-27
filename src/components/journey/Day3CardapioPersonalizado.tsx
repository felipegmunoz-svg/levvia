import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Clock, Users } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import {
  filterRecipesForProfile,
  fetchRecipes,
  type DbRecipe,
} from "@/lib/profileEngine";
import { useEffect } from "react";

interface Day3CardapioProps {
  onContinue: () => void;
}

type MealSlot = "Café da Manhã" | "Lanche da Manhã" | "Almoço" | "Lanche da Tarde" | "Jantar";

const MEAL_SLOTS: { slot: MealSlot; icon: string }[] = [
  { slot: "Café da Manhã", icon: "☀️" },
  { slot: "Lanche da Manhã", icon: "🍎" },
  { slot: "Almoço", icon: "🍽️" },
  { slot: "Lanche da Tarde", icon: "🫖" },
  { slot: "Jantar", icon: "🌙" },
];

const slotMapping: Record<MealSlot, string[]> = {
  "Café da Manhã": ["Café da Manhã"],
  "Lanche da Manhã": ["Lanche da Manhã", "Lanche"],
  "Almoço": ["Almoço"],
  "Lanche da Tarde": ["Lanche da Tarde", "Lanche"],
  "Jantar": ["Jantar"],
};

const Day3CardapioPersonalizado = ({ onContinue }: Day3CardapioProps) => {
  const { profile } = useProfile();
  const [recipes, setRecipes] = useState<DbRecipe[]>([]);
  const [expandedSlot, setExpandedSlot] = useState<MealSlot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes().then((data) => {
      setRecipes(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () => filterRecipesForProfile(recipes, profile),
    [recipes, profile]
  );

  const mealPlan = useMemo(() => {
    const plan: Record<MealSlot, DbRecipe | null> = {
      "Café da Manhã": null,
      "Lanche da Manhã": null,
      "Almoço": null,
      "Lanche da Tarde": null,
      "Jantar": null,
    };

    for (const { slot } of MEAL_SLOTS) {
      const types = slotMapping[slot];
      const available = filtered.filter((r) =>
        r.tipo_refeicao?.some((t) => types.includes(t))
      );
      if (available.length > 0) {
        // Day 3 offset = 2
        plan[slot] = available[2 % available.length];
      }
    }
    return plan;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background px-6 py-10 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p
          className="text-secondary tracking-[0.2em] mb-3"
          style={{ fontWeight: 500, fontSize: "0.7rem" }}
        >
          CARDÁPIO DO DIA
        </p>
        <h1
          className="text-foreground italic mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
          }}
        >
          Seu Cardápio Personalizado
        </h1>
        <p
          className="text-foreground/60 max-w-md mx-auto leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.9rem" }}
        >
          Este cardápio foi montado com base no seu perfil e alinhado ao Semáforo
          Alimentar. Toque em cada refeição para ver a receita completa.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3 max-w-md mx-auto">
          {MEAL_SLOTS.map(({ slot, icon }, i) => {
            const recipe = mealPlan[slot];
            const isExpanded = expandedSlot === slot;

            return (
              <motion.div
                key={slot}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="levvia-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSlot(isExpanded ? null : slot)}
                  className="w-full flex items-center gap-3 p-4"
                >
                  <span className="text-xl">{icon}</span>
                  <div className="text-left flex-1">
                    <p className="text-foreground text-sm font-medium">{slot}</p>
                    <p className="text-foreground/50 text-xs">
                      {recipe?.title || "Sem sugestão disponível"}
                    </p>
                  </div>
                  {recipe && (
                    <span className="text-foreground/40">
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  )}
                </button>

                {isExpanded && recipe && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 border-t border-border"
                  >
                    {/* Meta */}
                    <div className="flex gap-4 mt-3 mb-3">
                      {recipe.time && (
                        <span className="flex items-center gap-1 text-foreground/50 text-xs">
                          <Clock size={12} /> {recipe.time}
                        </span>
                      )}
                      {recipe.servings && (
                        <span className="flex items-center gap-1 text-foreground/50 text-xs">
                          <Users size={12} /> {recipe.servings}
                        </span>
                      )}
                    </div>

                    {/* Ingredients */}
                    {recipe.ingredients?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-secondary text-xs font-medium mb-1.5">
                          Ingredientes
                        </p>
                        <ul className="space-y-1">
                          {recipe.ingredients.map((ing, idx) => (
                            <li
                              key={idx}
                              className="text-foreground/70 text-xs flex items-start gap-1.5"
                            >
                              <span className="text-secondary mt-0.5">•</span>
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Instructions */}
                    {recipe.instructions?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-secondary text-xs font-medium mb-1.5">
                          Modo de Preparo
                        </p>
                        <ol className="space-y-1.5">
                          {recipe.instructions.map((step, idx) => (
                            <li
                              key={idx}
                              className="text-foreground/70 text-xs flex items-start gap-2"
                            >
                              <span className="text-secondary font-medium min-w-[16px]">
                                {idx + 1}.
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Why it cools */}
                    {recipe.por_que_resfria && (
                      <div className="bg-success/10 rounded-xl p-3 mt-2">
                        <p className="text-success text-xs font-medium mb-1">
                          🌿 Por que resfria?
                        </p>
                        <p className="text-foreground/60 text-xs leading-relaxed">
                          {recipe.por_que_resfria}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 flex justify-center"
      >
        <button
          onClick={onContinue}
          className="w-full max-w-xs py-4 rounded-3xl bg-primary text-primary-foreground font-medium text-sm"
        >
          Finalizar Dia 3 →
        </button>
      </motion.div>
    </div>
  );
};

export default Day3CardapioPersonalizado;
