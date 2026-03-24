import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Day4SleepHygieneProps {
  onContinue: (data: Record<string, boolean>) => void;
}

const ITEMS = [
  { key: "screenOff", label: "Desligue telas 1h antes de dormir", emoji: "📱" },
  { key: "warmBath", label: "Tome um banho morno relaxante", emoji: "🛁" },
  { key: "lightReading", label: "Leitura leve (nada estimulante)", emoji: "📖" },
  { key: "calmingTea", label: "Chá calmante (camomila, erva-cidreira)", emoji: "🍵" },
  { key: "darkRoom", label: "Quarto escuro, fresco e silencioso", emoji: "🌙" },
];

const Day4SleepHygiene = ({ onContinue }: Day4SleepHygieneProps) => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    Object.fromEntries(ITEMS.map((i) => [i.key, false]))
  );

  const allChecked = Object.values(checklist).every(Boolean);
  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const toggle = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">🛏️</span>
          <h2
            className="text-foreground mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
            }}
          >
            Higiene do Sono
          </h2>
          <p className="text-foreground/60 text-sm" style={{ fontWeight: 300, lineHeight: 1.7 }}>
            Marque cada item conforme você for preparando seu ritual noturno.
            Não precisa ser tudo de uma vez — o importante é começar.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {ITEMS.map((item, i) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              onClick={() => toggle(item.key)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                checklist[item.key]
                  ? "border-success/40 bg-success/5"
                  : "border-white/10 bg-white/[0.04] hover:border-secondary/30"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  checklist[item.key]
                    ? "bg-success text-white"
                    : "border-2 border-white/20"
                }`}
              >
                {checklist[item.key] && <Check size={14} strokeWidth={3} />}
              </div>
              <span className="text-xl flex-shrink-0">{item.emoji}</span>
              <span
                className={`text-sm ${
                  checklist[item.key] ? "text-foreground" : "text-foreground/70"
                }`}
                style={{ fontWeight: 300 }}
              >
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>

        {allChecked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 mb-6 text-center"
          >
            <p className="text-success text-sm font-medium">
              ✨ Perfeito! Você criou um ambiente ideal para descanso restaurador.
            </p>
          </motion.div>
        )}

        <p className="text-xs text-foreground/40 text-center mb-4">
          {checkedCount}/{ITEMS.length} preparados
        </p>

        <button
          onClick={() => onContinue(checklist)}
          className="w-full py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
        >
          Continuar para Respiração Guiada →
        </button>
      </motion.div>
    </div>
  );
};

export default Day4SleepHygiene;
