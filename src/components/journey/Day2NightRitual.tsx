import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Day2NightRitualProps {
  onNext: () => void;
}

const ritualSteps = [
  {
    emoji: "🍵",
    title: "Chá de Camomila e Gengibre",
    description:
      "Prepare um chá morno. A camomila acalma o sistema nervoso e o gengibre auxilia na digestão e circulação. Beba devagar, sentindo o calor percorrer seu corpo.",
  },
  {
    emoji: "🤲",
    title: "Automassagem Suave",
    description:
      "Enquanto bebe o chá, faça uma automassagem suave nas áreas que você mapeou como inchadas ou doloridas. Use um óleo neutro (como óleo de coco) se desejar. Movimentos leves e ascendentes, sempre em direção ao coração.",
  },
  {
    emoji: "🌬️",
    title: "Respiração Diafragmática",
    description:
      "Deite-se e pratique a respiração diafragmática por 5-10 minutos. Inspire pelo nariz contando até 4, sinta a barriga subir. Expire pela boca contando até 6, sinta a barriga descer. Acalme seu sistema nervoso.",
  },
];

const Day2NightRitual = ({ onNext }: Day2NightRitualProps) => {
  const [completed, setCompleted] = useState<boolean[]>([false, false, false]);

  const toggleStep = (index: number) => {
    const updated = [...completed];
    updated[index] = !updated[index];
    setCompleted(updated);
  };

  const allDone = completed.every(Boolean);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-secondary text-center mb-2 tracking-[0.2em]"
        style={{ fontWeight: 500, fontSize: "0.75rem" }}
      >
        MOMENTO DESCANSO
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-foreground text-center mb-2"
        style={{ fontWeight: 500, fontSize: "1.1rem" }}
      >
        😴 Ritual de Desinflamação Noturna
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-foreground/60 text-center mb-8 max-w-sm"
        style={{ fontWeight: 300, fontSize: "0.85rem" }}
      >
        Prepare seu corpo e mente para um sono reparador, essencial para a desinflamação.
      </motion.p>

      <div className="w-full max-w-sm space-y-4 mb-8">
        {ritualSteps.map((step, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.15 }}
            onClick={() => toggleStep(i)}
            className={`glass-card p-4 w-full text-left transition-all ${
              completed[i] ? "border-secondary/30" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                  completed[i]
                    ? "bg-secondary border-secondary"
                    : "border-white/20"
                }`}
              >
                {completed[i] && <Check size={14} className="text-foreground" />}
              </div>
              <div className="flex-1">
                <p className="text-foreground text-sm font-medium mb-1">
                  {step.emoji} {step.title}
                </p>
                <p
                  className="text-foreground/60 leading-relaxed"
                  style={{ fontWeight: 300, fontSize: "0.8rem", lineHeight: 1.6 }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-foreground/50 text-center italic mb-8 max-w-xs"
        style={{ fontWeight: 300, fontSize: "0.85rem" }}
      >
        Boa noite, Amiga Sábia. Seu corpo está trabalhando para você, mesmo enquanto você descansa.
      </motion.p>

      <button
        onClick={onNext}
        disabled={!allDone}
        className={`w-full max-w-xs py-4 rounded-3xl font-medium text-sm transition-all ${
          allDone
            ? "gradient-primary text-foreground"
            : "bg-white/10 text-foreground/30 cursor-not-allowed"
        }`}
      >
        {allDone ? "Completei o Ritual →" : "Complete os 3 passos acima"}
      </button>
    </div>
  );
};

export default Day2NightRitual;
