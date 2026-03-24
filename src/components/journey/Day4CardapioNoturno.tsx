import { motion } from "framer-motion";

interface Day4CardapioNoturnoProps {
  onContinue: () => void;
}

const MEALS = [
  {
    name: "Jantar Anti-inflamatório",
    recipe: "Salmão Grelhado com Espinafre e Cúrcuma",
    emoji: "🍽️",
    nutrient: "Rico em Ômega-3 e Magnésio — reduz inflamação noturna",
  },
  {
    name: "Lanche Noturno (opcional)",
    recipe: "Banana com Pasta de Amendoim e Canela",
    emoji: "🍌",
    nutrient: "Triptofano + Magnésio = produção natural de Melatonina",
  },
  {
    name: "Chá da Noite",
    recipe: "Camomila com Mel e Gengibre",
    emoji: "🍵",
    nutrient: "Calmante natural — reduz cortisol antes de dormir",
  },
];

const Day4CardapioNoturno = ({ onContinue }: Day4CardapioNoturnoProps) => {
  return (
    <div className="min-h-screen bg-background px-6 py-12">
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
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="glass-card p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl flex-shrink-0">{meal.emoji}</span>
                <div>
                  <h3 className="text-foreground text-sm font-medium">{meal.name}</h3>
                  <p className="text-foreground/60 text-sm" style={{ fontWeight: 300 }}>
                    {meal.recipe}
                  </p>
                </div>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-xl px-3 py-2">
                <p className="text-success/90 text-xs" style={{ fontWeight: 300, lineHeight: 1.6 }}>
                  💡 {meal.nutrient}
                </p>
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
          <p className="text-foreground/50 text-xs italic" style={{ fontWeight: 300, lineHeight: 1.7 }}>
            💜 Dica: Evite alimentos pesados, cafeína e álcool nas 3 horas antes de dormir.
            Seu corpo agradece com um sono mais profundo e restaurador.
          </p>
        </motion.div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
        >
          Finalizar Dia 4 →
        </button>
      </motion.div>
    </div>
  );
};

export default Day4CardapioNoturno;
