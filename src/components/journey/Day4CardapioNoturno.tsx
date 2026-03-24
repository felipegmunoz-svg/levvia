import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Day4CardapioNoturnoProps {
  onContinue: () => void;
}

const MEALS = [
  {
    id: 1,
    name: "Jantar Anti-inflamatório",
    recipe: "Salmão Grelhado com Espinafre e Cúrcuma",
    emoji: "🍽️",
    nutrient: "Rico em Ômega-3 e Magnésio — reduz inflamação noturna",
    ingredients: [
      "1 filé de salmão (150g)",
      "2 xícaras de espinafre fresco",
      "1 colher de azeite de oliva extravirgem",
      "½ colher de chá de cúrcuma em pó",
      "Limão e alho a gosto",
    ],
    instructions:
      "Tempere o salmão com limão, alho e cúrcuma. Grelhe por 4-5 minutos de cada lado. Refogue o espinafre no azeite com uma pitada de sal. Sirva juntos.",
  },
  {
    id: 2,
    name: "Lanche Noturno (opcional)",
    recipe: "Banana com Pasta de Amendoim e Canela",
    emoji: "🍌",
    nutrient: "Triptofano + Magnésio = produção natural de Melatonina",
    ingredients: [
      "1 banana madura",
      "1 colher de sopa de pasta de amendoim integral",
      "Canela em pó a gosto",
    ],
    instructions:
      "Corte a banana em rodelas. Espalhe a pasta de amendoim por cima. Polvilhe canela. Pronto — simples e poderoso!",
  },
  {
    id: 3,
    name: "Chá da Noite",
    recipe: "Camomila com Mel e Gengibre",
    emoji: "🍵",
    nutrient: "Calmante natural — reduz cortisol antes de dormir",
    ingredients: [
      "1 sachê de camomila (ou 1 colher de flores secas)",
      "1 colher de chá de mel",
      "2 fatias finas de gengibre fresco",
      "200ml de água quente",
    ],
    instructions:
      "Coloque o sachê e o gengibre na água quente. Deixe em infusão por 5 minutos. Retire o gengibre, adoce com mel. Beba morno, 30 minutos antes de dormir.",
  },
];

const Day4CardapioNoturno = ({ onContinue }: Day4CardapioNoturnoProps) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (id: number) => setExpanded(expanded === id ? null : id);

  return (
    <div className="min-h-screen bg-background px-6 py-12 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">🥗</span>
          <h2
            className="text-foreground mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
            }}
          >
            Cardápio do Sono
          </h2>
          <p
            className="text-foreground/60 text-sm max-w-sm mx-auto"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            Estes alimentos contêm triptofano e magnésio — nutrientes que ajudam
            seu corpo a produzir melatonina, o hormônio do sono.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {MEALS.map((meal, i) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="glass-card overflow-hidden"
            >
              {/* Header — clickable */}
              <button
                onClick={() => toggle(meal.id)}
                className="w-full p-4 flex items-start gap-3 text-left"
              >
                <span className="text-3xl flex-shrink-0">{meal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground text-sm font-medium">{meal.name}</h3>
                  <p className="text-foreground/60 text-sm" style={{ fontWeight: 300 }}>
                    {meal.recipe}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: expanded === meal.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 mt-1"
                >
                  <ChevronDown size={18} className="text-foreground/40" />
                </motion.div>
              </button>

              {/* Expandable details */}
              <AnimatePresence>
                {expanded === meal.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {/* Nutrient badge */}
                      <div className="bg-success/5 border border-success/20 rounded-xl px-3 py-2">
                        <p className="text-success/90 text-xs" style={{ fontWeight: 300, lineHeight: 1.6 }}>
                          💡 {meal.nutrient}
                        </p>
                      </div>

                      {/* Ingredients */}
                      <div>
                        <p className="text-foreground/80 text-xs font-medium mb-1.5">Ingredientes:</p>
                        <ul className="space-y-1">
                          {meal.ingredients.map((ing, j) => (
                            <li key={j} className="text-foreground/60 text-xs flex items-start gap-1.5" style={{ fontWeight: 300 }}>
                              <span className="text-secondary/60 mt-0.5">•</span>
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div>
                        <p className="text-foreground/80 text-xs font-medium mb-1.5">Modo de preparo:</p>
                        <p className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
                          {meal.instructions}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 mb-8 text-center"
        >
          <p className="text-foreground/50 text-xs italic" style={{ fontWeight: 300, lineHeight: 1.7 }}>
            💜 Dica: Evite alimentos pesados, cafeína e álcool nas 3 horas antes de dormir.
            Seu corpo agradece com um sono mais profundo e restaurador.
          </p>
        </motion.div>
      </motion.div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/5 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <button
          onClick={onContinue}
          className="w-full max-w-xs mx-auto py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm block"
        >
          Finalizar Dia 4 →
        </button>
      </div>
    </div>
  );
};

export default Day4CardapioNoturno;
