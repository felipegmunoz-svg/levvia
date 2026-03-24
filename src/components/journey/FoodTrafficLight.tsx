import { useState } from "react";
import { motion } from "framer-motion";

interface FoodTrafficLightProps {
  onContinue: () => void;
}

const greenFoods = [
  { name: "Vegetais verde-escuros", icon: "🥬" },
  { name: "Frutas vermelhas", icon: "🫐" },
  { name: "Azeite de oliva", icon: "🫒" },
  { name: "Peixes ômega-3", icon: "🐟" },
  { name: "Sementes", icon: "🌰" },
  { name: "Cúrcuma", icon: "🧂" },
  { name: "Gengibre", icon: "🫚" },
  { name: "Chás de ervas", icon: "🍵" },
];

const yellowFoods = [
  { name: "Grãos integrais", icon: "🌾" },
  { name: "Leguminosas", icon: "🫘" },
  { name: "Laticínios", icon: "🥛" },
  { name: "Carnes magras", icon: "🍗" },
  { name: "Frutas doces", icon: "🍌" },
  { name: "Queijos brancos", icon: "🧀" },
];

const redFoods = [
  { name: "Açúcar refinado", icon: "🍬" },
  { name: "Ultraprocessados", icon: "📦" },
  { name: "Refrigerantes", icon: "🥤" },
  { name: "Frituras", icon: "🍟" },
  { name: "Farinha branca", icon: "🍞" },
  { name: "Embutidos", icon: "🌭" },
  { name: "Fast food", icon: "🍔" },
  { name: "Doces industrializados", icon: "🍰" },
];

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.25, duration: 0.5 },
  }),
};

const FoodTrafficLight = ({ onContinue }: FoodTrafficLightProps) => {
  const [expanded, setExpanded] = useState<"green" | "yellow" | "red" | null>("green");

  const sections = [
    {
      key: "green" as const,
      emoji: "🟢",
      title: "PRIORIZE",
      color: "hsl(var(--success))",
      borderColor: "border-success/30",
      bgColor: "bg-success/10",
      description:
        "Estes são seus super-heróis anti-inflamatórios! Consuma à vontade e com prazer.",
      foods: greenFoods,
    },
    {
      key: "yellow" as const,
      emoji: "🟡",
      title: "MODERE",
      color: "hsl(var(--accent))",
      borderColor: "border-accent/30",
      bgColor: "bg-accent/10",
      description:
        "Consuma com consciência. Não são inimigos, mas em excesso podem atrapalhar seu processo de desinflamação.",
      foods: yellowFoods,
    },
    {
      key: "red" as const,
      emoji: "🔴",
      title: "EVITE",
      color: "hsl(var(--destructive))",
      borderColor: "border-destructive/30",
      bgColor: "bg-destructive/10",
      description:
        "Estes são os gatilhos que alimentam a inflamação. Tente evitá-los ao máximo para sentir a verdadeira leveza.",
      foods: redFoods,
    },
  ];

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
          SEU SEMÁFORO ALIMENTAR
        </p>
        <h1
          className="text-foreground italic mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
          }}
        >
          Seu Guia de Escolhas Diárias
        </h1>
        <p
          className="text-foreground/60 max-w-md mx-auto leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.9rem" }}
        >
          Este semáforo é um guia visual para as suas escolhas diárias. Ele não é
          uma lista de "proibidos", mas um mapa para você navegar no mundo da
          comida com inteligência e gentileza.
        </p>
      </motion.div>

      <div className="space-y-4 max-w-md mx-auto">
        {sections.map((section, i) => (
          <motion.div
            key={section.key}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={sectionVariant}
            className={`rounded-2xl border ${section.borderColor} overflow-hidden`}
          >
            <button
              onClick={() =>
                setExpanded(expanded === section.key ? null : section.key)
              }
              className={`w-full flex items-center gap-3 p-4 ${section.bgColor} transition-colors`}
            >
              <span className="text-2xl">{section.emoji}</span>
              <span
                className="text-foreground font-medium tracking-wide text-sm"
                style={{ letterSpacing: "0.05em" }}
              >
                {section.title}
              </span>
              <span className="ml-auto text-foreground/40 text-xs">
                {expanded === section.key ? "▲" : "▼"}
              </span>
            </button>

            {expanded === section.key && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <p
                  className="text-foreground/60 mb-3 leading-relaxed"
                  style={{ fontWeight: 300, fontSize: "0.85rem" }}
                >
                  {section.description}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {section.foods.map((food) => (
                    <div
                      key={food.name}
                      className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3 py-2"
                    >
                      <span className="text-lg">{food.icon}</span>
                      <span className="text-foreground/80 text-xs">
                        {food.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 flex justify-center"
      >
        <button
          onClick={onContinue}
          className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
        >
          Continuar para o Cardápio do Dia →
        </button>
      </motion.div>
    </div>
  );
};

export default FoodTrafficLight;
