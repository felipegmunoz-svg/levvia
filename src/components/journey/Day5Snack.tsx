import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Day5SnackProps {
  onContinue: () => void;
}

interface SnackOption {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  benefit: string;
  ingredients: string[];
  instructions: string;
}

const SNACKS: SnackOption[] = [
  {
    id: "smoothie_verde",
    name: "Smoothie Verde Detox",
    subtitle: "com Abacaxi e Hortelã",
    emoji: "🥤",
    benefit:
      "O abacaxi contém bromelina, uma enzima que auxilia na digestão e tem propriedades anti-inflamatórias, enquanto a hortelã refresca e facilita o fluxo.",
    ingredients: [
      "1 xícara de abacaxi picado",
      "1 xícara de espinafre fresco",
      "1/2 pepino",
      "1 ramo de hortelã",
      "1 colher de sopa de linhaça",
      "200ml de água de coco",
    ],
    instructions:
      "Bata todos os ingredientes no liquidificador até ficar homogêneo. Beba fresco, de preferência logo após o preparo.",
  },
  {
    id: "smoothie_tropical",
    name: "Smoothie Tropical Energético",
    subtitle: "com Manga e Gengibre",
    emoji: "🥭",
    benefit:
      "O gengibre é um poderoso anti-inflamatório natural, enquanto a manga facilita a digestão e fornece energia limpa para o movimento.",
    ingredients: [
      "1 xícara de manga picada",
      "1/2 banana madura",
      "1 pedaço pequeno de gengibre fresco",
      "1 colher de sopa de chia",
      "200ml de leite de coco (ou vegetal)",
    ],
    instructions:
      "Bata todos os ingredientes no liquidificador até cremoso. O gengibre pode ser ajustado conforme seu gosto. Beba fresco.",
  },
  {
    id: "smoothie_vermelho",
    name: "Smoothie Vermelho Antioxidante",
    subtitle: "com Frutas Vermelhas e Beterraba",
    emoji: "🍓",
    benefit:
      "As frutas vermelhas são ricas em antioxidantes, enquanto a beterraba melhora a circulação sanguínea e o fluxo linfático.",
    ingredients: [
      "1/2 xícara de morangos",
      "1/2 xícara de framboesas (ou mirtilos)",
      "1/4 de beterraba crua ralada",
      "1 colher de sopa de linhaça",
      "200ml de água de coco",
    ],
    instructions:
      "Bata todos os ingredientes até ficar homogêneo. A beterraba dá uma cor vibrante e sabor levemente adocicado. Beba fresco.",
  },
];

const Day5Snack = ({ onContinue }: Day5SnackProps) => {
  const [selectedSnack, setSelectedSnack] = useState<string | null>(null);

  const canContinue = selectedSnack !== null;

  return (
    <div className="min-h-screen bg-background px-6 py-12 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">🥤</span>
          <h2
            className="text-foreground mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
            }}
          >
            Sua Refeição de Fluxo
          </h2>
          <p
            className="text-foreground/60 text-sm max-w-sm mx-auto"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            Para apoiar o movimento do seu corpo, um lanche nutritivo e fácil de
            digerir é essencial. Escolha a opção que mais te agrada:
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {SNACKS.map((snack, i) => {
            const isSelected = selectedSnack === snack.id;

            return (
              <motion.div
                key={snack.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`levvia-card overflow-hidden cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-secondary/60"
                    : "hover:ring-1 hover:ring-border"
                }`}
                onClick={() =>
                  setSelectedSnack((prev) =>
                    prev === snack.id ? null : snack.id
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

                  <span className="text-2xl flex-shrink-0">{snack.emoji}</span>

                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium">
                      {snack.name}
                    </p>
                    <p
                      className="text-foreground/50 text-xs"
                      style={{ fontWeight: 300 }}
                    >
                      {snack.subtitle}
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
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        <div className="p-3 bg-green-500/10 rounded">
                          <p
                            className="text-foreground/80 text-xs"
                            style={{ fontWeight: 300, lineHeight: 1.7 }}
                          >
                            <strong>💡 Benefício:</strong> {snack.benefit}
                          </p>
                        </div>

                        <div>
                          <p className="text-foreground/80 text-xs font-medium mb-1.5">
                            Ingredientes:
                          </p>
                          <ul className="space-y-1">
                            {snack.ingredients.map((ing, j) => (
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
                            {snack.instructions}
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
          className="levvia-card p-4 mb-8 text-center"
        >
          <p
            className="text-foreground/50 text-xs italic"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            💡 Dica: Prepare seu smoothie logo antes ou depois do movimento
            gentil para aproveitar a energia limpa e os nutrientes frescos.
          </p>
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm block transition-all ${
            canContinue
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          {canContinue
            ? "Continuar para Diário de Leveza →"
            : "Escolha seu smoothie para continuar"}
        </button>
      </div>
    </div>
  );
};

export default Day5Snack;
