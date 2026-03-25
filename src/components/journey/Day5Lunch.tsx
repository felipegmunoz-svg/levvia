import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Day5LunchProps {
  onContinue: (choice: string) => void;
}

interface MealOption {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  benefit: string;
  ingredients: string[];
  instructions: string;
}

const MEALS: MealOption[] = [
  {
    id: "bowl_quinoa",
    name: "Bowl de Quinoa com Cúrcuma",
    subtitle: "Poder Anti-inflamatório Completo",
    emoji: "🥗",
    benefit:
      "A cúrcuma (açafrão) é um dos anti-inflamatórios naturais mais potentes, enquanto a quinoa fornece proteína vegetal e magnésio para relaxamento muscular.",
    ingredients: [
      "1 xícara de quinoa cozida",
      "1 colher (chá) de cúrcuma em pó",
      "1 xícara de legumes assados (abobrinha, pimentão, tomate-cereja)",
      "1/2 abacate fatiado",
      "1 colher (sopa) de azeite extra-virgem",
      "1 punhado de folhas verdes (rúcula ou espinafre)",
      "Sal rosa e pimenta-do-reino a gosto",
    ],
    instructions:
      "Cozinhe a quinoa com a cúrcuma. Asse os legumes no forno com azeite. Monte o bowl: quinoa de base, legumes assados, folhas verdes, abacate. Finalize com azeite, sal e pimenta.",
  },
  {
    id: "salmao_legumes",
    name: "Salmão Grelhado com Legumes",
    subtitle: "Ômega-3 para Reduzir Inflamação",
    emoji: "🐟",
    benefit:
      "O salmão é rico em ômega-3, gordura essencial que reduz inflamação crônica. Combinado com legumes coloridos, fornece antioxidantes e fibras.",
    ingredients: [
      "1 filé de salmão (150-200g)",
      "1 colher (sopa) de azeite",
      "1 limão (suco)",
      "2 xícaras de legumes variados (brócolis, cenoura, abobrinha)",
      "Alho, sal rosa e ervas frescas (tomilho ou alecrim)",
      "1 porção de arroz integral (opcional)",
    ],
    instructions:
      "Tempere o salmão com limão, alho e ervas. Grelhe 4-5 min de cada lado. Cozinhe os legumes no vapor ou salteados no azeite. Sirva com arroz integral se desejar.",
  },
  {
    id: "frango_batata_doce",
    name: "Frango com Batata-Doce Assada",
    subtitle: "Energia Sustentada e Músculo Saudável",
    emoji: "🍗",
    benefit:
      "Proteína magra do frango + carboidrato complexo da batata-doce = energia sem picos de açúcar. Perfeito para manter movimento ao longo do dia.",
    ingredients: [
      "1 filé de peito de frango (150g)",
      "1 batata-doce média",
      "1 colher (sopa) de azeite",
      "1 colher (chá) de páprica doce",
      "Sal rosa, alho e limão",
      "Salada verde de acompanhamento",
    ],
    instructions:
      "Tempere o frango com alho, limão e páprica. Grelhe ou asse. Corte a batata-doce em rodelas, regue com azeite e sal, asse a 200°C por 25-30 min. Sirva com salada verde.",
  },
];

const Day5Lunch = ({ onContinue }: Day5LunchProps) => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const canContinue = selectedMeal !== null;

  return (
    <div className="min-h-screen bg-background px-6 py-12 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">🍽️</span>
          <h2
            className="text-foreground mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
            }}
          >
            Almoço Anti-inflamatório
          </h2>
          <p
            className="text-foreground/60 text-sm max-w-sm mx-auto"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            Para sustentar o movimento que você cultivou de manhã, seu corpo
            precisa do combustível certo. Escolha uma refeição que nutre e
            desinflama:
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {MEALS.map((meal, i) => {
            const isSelected = selectedMeal === meal.id;

            return (
              <motion.div
                key={meal.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`glass-card overflow-hidden cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-secondary/60"
                    : "hover:ring-1 hover:ring-white/10"
                }`}
                onClick={() =>
                  setSelectedMeal((prev) =>
                    prev === meal.id ? null : meal.id
                  )
                }
              >
                <div className="p-3.5 flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-secondary bg-secondary"
                        : "border-foreground/20"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-secondary-foreground rounded-full" />
                    )}
                  </div>

                  <span className="text-2xl flex-shrink-0">{meal.emoji}</span>

                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium">
                      {meal.name}
                    </p>
                    <p
                      className="text-foreground/50 text-xs"
                      style={{ fontWeight: 300 }}
                    >
                      {meal.subtitle}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                        <div className="p-3 bg-green-500/10 rounded">
                          <p
                            className="text-foreground/80 text-xs"
                            style={{ fontWeight: 300, lineHeight: 1.7 }}
                          >
                            <strong>💡 Benefício:</strong> {meal.benefit}
                          </p>
                        </div>

                        <div>
                          <p className="text-foreground/80 text-xs font-medium mb-1.5">
                            Ingredientes:
                          </p>
                          <ul className="space-y-1">
                            {meal.ingredients.map((ing, j) => (
                              <li
                                key={j}
                                className="text-foreground/60 text-xs flex items-start gap-1.5"
                                style={{ fontWeight: 300 }}
                              >
                                <span className="text-secondary/60 mt-0.5">
                                  •
                                </span>
                                {ing}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-foreground/80 text-xs font-medium mb-1.5">
                            Modo de preparo:
                          </p>
                          <p
                            className="text-foreground/60 text-xs"
                            style={{ fontWeight: 300, lineHeight: 1.7 }}
                          >
                            {meal.instructions}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 mb-8 text-center"
        >
          <p
            className="text-foreground/50 text-xs italic"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            💡 Dica: Coma devagar e mastigue bem. Seu corpo precisa de
            nutrientes para sustentar o movimento que você está cultivando hoje.
          </p>
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/5 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <button
          onClick={() => selectedMeal && onContinue(selectedMeal)}
          disabled={!canContinue}
          className={`w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm block transition-all ${
            canContinue
              ? "gradient-primary text-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          {canContinue
            ? "Continuar para Lanche da Tarde →"
            : "Escolha sua refeição para continuar"}
        </button>
      </div>
    </div>
  );
};

export default Day5Lunch;
