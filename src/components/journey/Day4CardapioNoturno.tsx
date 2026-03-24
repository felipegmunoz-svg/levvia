import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Day4CardapioNoturnoProps {
  onContinue: () => void;
}

interface MealOption {
  id: string;
  name: string;
  icon: string;
  nutrients: string;
  ingredients: string[];
  instructions: string;
}

interface MealCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  options: MealOption[];
}

const MEALS: MealCategory[] = [
  {
    id: "jantar",
    name: "Jantar Anti-inflamatório",
    icon: "🍽️",
    description: "Escolha sua receita anti-inflamatória:",
    options: [
      {
        id: "jantar_1",
        name: "Salmão Grelhado com Espinafre",
        icon: "🐟",
        nutrients: "Ômega-3 + Magnésio — reduz inflamação noturna",
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
        id: "jantar_2",
        name: "Tofu Grelhado com Brócolis",
        icon: "🥦",
        nutrients: "Magnésio + Cálcio — relaxamento muscular",
        ingredients: [
          "200g de tofu firme",
          "2 xícaras de brócolis",
          "1 colher de azeite",
          "Shoyu e gengibre a gosto",
        ],
        instructions:
          "Corte o tofu em cubos. Grelhe até dourar. Cozinhe brócolis no vapor por 5 min. Tempere com shoyu e gengibre.",
      },
      {
        id: "jantar_3",
        name: "Frango com Batata Doce Assada",
        icon: "🍗",
        nutrients: "Triptofano + Magnésio — produção de melatonina",
        ingredients: [
          "150g de peito de frango",
          "1 batata doce média",
          "Alecrim e azeite",
          "Sal e pimenta a gosto",
        ],
        instructions:
          "Tempere o frango com alecrim. Grelhe por 6-7 min cada lado. Asse a batata doce em cubos por 25 min a 200°C.",
      },
    ],
  },
  {
    id: "lanche",
    name: "Lanche Noturno",
    icon: "🥜",
    description: "Escolha seu snack pro-sono:",
    options: [
      {
        id: "lanche_1",
        name: "Banana com Pasta de Amendoim",
        icon: "🍌",
        nutrients: "Triptofano + Magnésio = Melatonina",
        ingredients: [
          "1 banana madura",
          "1 colher de sopa de pasta de amendoim integral",
          "Canela em pó a gosto",
        ],
        instructions:
          "Corte a banana em rodelas. Espalhe a pasta de amendoim por cima. Polvilhe canela. Pronto — simples e poderoso!",
      },
      {
        id: "lanche_2",
        name: "Mix de Castanhas e Frutas Secas",
        icon: "🥜",
        nutrients: "Magnésio + Melatonina natural",
        ingredients: [
          "5 castanhas-do-pará",
          "5 amêndoas",
          "3 damascos secos",
          "1 colher de sopa de uvas passas",
        ],
        instructions:
          "Misture todos os ingredientes. Porção ideal: 1 punhado (30g). Coma devagar, saboreando.",
      },
      {
        id: "lanche_3",
        name: "Torrada Integral com Abacate",
        icon: "🥑",
        nutrients: "Magnésio + Gorduras Boas",
        ingredients: [
          "1 fatia de pão integral",
          "½ abacate maduro",
          "Sal rosa e limão",
          "Sementes de chia (opcional)",
        ],
        instructions:
          "Toste o pão. Amasse o abacate com sal e limão. Espalhe no pão. Polvilhe chia por cima.",
      },
    ],
  },
  {
    id: "cha",
    name: "Chá da Noite",
    icon: "🍵",
    description: "Escolha seu chá calmante:",
    options: [
      {
        id: "cha_1",
        name: "Camomila com Mel e Gengibre",
        icon: "🍵",
        nutrients: "Calmante natural — reduz cortisol",
        ingredients: [
          "1 sachê de camomila (ou 1 colher de flores secas)",
          "1 colher de chá de mel",
          "2 fatias finas de gengibre fresco",
          "200ml de água quente",
        ],
        instructions:
          "Coloque o sachê e o gengibre na água quente. Deixe em infusão por 5 minutos. Retire o gengibre, adoce com mel. Beba morno, 30 min antes de dormir.",
      },
      {
        id: "cha_2",
        name: "Erva-Cidreira",
        icon: "🌿",
        nutrients: "Relaxante muscular natural",
        ingredients: [
          "1 sachê de erva-cidreira",
          "200ml de água quente",
          "Mel a gosto (opcional)",
        ],
        instructions:
          "Infusão por 7 min. Adoce se desejar. Beba morno antes de dormir.",
      },
      {
        id: "cha_3",
        name: "Maracujá",
        icon: "🫖",
        nutrients: "Indutor natural do sono",
        ingredients: [
          "1 sachê de maracujá",
          "200ml de água quente",
          "Mel (opcional)",
        ],
        instructions:
          "Infusão por 5 min. Adoce com mel se preferir. Beba 30 min antes de dormir.",
      },
    ],
  },
];

const Day4CardapioNoturno = ({ onContinue }: Day4CardapioNoturnoProps) => {
  const [selectedMeals, setSelectedMeals] = useState<Record<string, string>>({});

  const allSelected = ["jantar", "lanche", "cha"].every((id) => selectedMeals[id]);

  const toggleSelection = (categoryId: string, optionId: string) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === optionId ? undefined! : optionId,
    }));
  };

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
            Escolha uma receita de cada categoria. Alimentos com triptofano e
            magnésio ajudam seu corpo a produzir melatonina naturalmente.
          </p>
        </div>

        <div className="space-y-8 mb-10">
          {MEALS.map((category, ci) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * ci }}
            >
              {/* Category header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{category.icon}</span>
                <h3
                  className="text-foreground font-medium"
                  style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)" }}
                >
                  {category.name}
                </h3>
              </div>
              <p
                className="text-foreground/50 text-xs mb-3"
                style={{ fontWeight: 300 }}
              >
                {category.description}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {category.options.map((option) => {
                  const isSelected = selectedMeals[category.id] === option.id;

                  return (
                    <motion.div
                      key={option.id}
                      layout
                      className={`glass-card overflow-hidden cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "ring-2 ring-secondary/60"
                          : "hover:ring-1 hover:ring-white/10"
                      }`}
                      onClick={() => toggleSelection(category.id, option.id)}
                    >
                      {/* Option header */}
                      <div className="p-3.5 flex items-center gap-3">
                        {/* Radio indicator */}
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

                        <span className="text-2xl flex-shrink-0">{option.icon}</span>

                        <div className="flex-1 min-w-0">
                          <p className="text-foreground text-sm font-medium">
                            {option.name}
                          </p>
                          <p
                            className="text-foreground/50 text-xs"
                            style={{ fontWeight: 300 }}
                          >
                            {option.nutrients}
                          </p>
                        </div>
                      </div>

                      {/* Expanded details */}
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
                              <div>
                                <p className="text-foreground/80 text-xs font-medium mb-1.5">
                                  Ingredientes:
                                </p>
                                <ul className="space-y-1">
                                  {option.ingredients.map((ing, j) => (
                                    <li
                                      key={j}
                                      className="text-foreground/60 text-xs flex items-start gap-1.5"
                                      style={{ fontWeight: 300 }}
                                    >
                                      <span className="text-secondary/60 mt-0.5">•</span>
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
                                  {option.instructions}
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
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 mb-8 text-center"
        >
          <p
            className="text-foreground/50 text-xs italic"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            💜 Dica: Evite alimentos pesados, cafeína e álcool nas 3 horas
            antes de dormir. Seu corpo agradece com um sono mais profundo e
            restaurador.
          </p>
        </motion.div>
      </motion.div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/5 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <button
          onClick={onContinue}
          disabled={!allSelected}
          className={`w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm block transition-all ${
            allSelected
              ? "gradient-primary text-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          {allSelected
            ? "Finalizar Dia 4 →"
            : "Selecione suas receitas para continuar"}
        </button>
      </div>
    </div>
  );
};

export default Day4CardapioNoturno;
