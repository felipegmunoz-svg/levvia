import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface Day5LegsElevationProps {
  onContinue: (duration: number) => void;
}

const DURATION_OPTIONS = [
  { value: 5, label: "5 minutos", emoji: "⏱️" },
  { value: 7, label: "7 minutos", emoji: "⏰" },
  { value: 10, label: "10 minutos", emoji: "🕐" },
];

const STEPS = [
  {
    title: "Deite-se de costas próximo a uma parede",
    detail: "Quanto mais perto, mais fácil elevar as pernas",
  },
  {
    title: "Suba as pernas pela parede até ficar em "L"",
    detail: "Quadril no chão, pernas retas apoiadas na parede",
  },
  {
    title: "Abra os braços em cruz ou descanse no abdômen",
    detail: "Posição confortável, sem tensão nos ombros",
  },
  {
    title: "Respire profundamente e relaxe",
    detail: "Deixe a gravidade drenar o excesso de líquido das pernas",
  },
  {
    title: "Permaneça por 5 a 10 minutos",
    detail: "Escolha a duração que for confortável para você hoje",
  },
];

const Day5LegsElevation = ({ onContinue }: Day5LegsElevationProps) => {
  const [duration, setDuration] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#2EC4B6", "#1B3F6B", "#2E86AB"],
    });
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <span className="text-5xl mb-3 block">🧘‍♀️</span>
          <h2
            className="text-foreground mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
            }}
          >
            Ritual de Elevação de Pernas
          </h2>
          <p
            className="text-foreground/60 text-sm max-w-sm mx-auto"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            A gravidade trabalhando a seu favor — 5 a 10 minutos que transformam
            como suas pernas se sentem
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <img
            src="/illustrations/legs-elevation-wall.png"
            alt="Posição pernas na parede"
            className="w-56 h-56 object-contain rounded-lg"
            loading="lazy"
            width={1024}
            height={1024}
          />
        </div>

        <div className="glass-card p-5 mb-6">
          <h3 className="text-foreground text-lg font-bold mb-4">
            Como Fazer:
          </h3>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {s.title}
                  </p>
                  <p
                    className="text-foreground/50 text-xs"
                    style={{ fontWeight: 300 }}
                  >
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!duration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <p className="text-foreground/80 text-sm font-semibold mb-3">
              Quanto tempo você vai dedicar hoje?
            </p>
            <div className="grid grid-cols-3 gap-3">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  className="glass-card p-4 text-center hover:ring-1 hover:ring-secondary/40 transition-all"
                >
                  <span className="text-2xl block mb-1">{opt.emoji}</span>
                  <p className="text-foreground text-xs font-bold">
                    {opt.label}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {duration && !completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <p className="text-foreground text-lg font-bold mb-2">
              ⏱️ {duration} minutos
            </p>
            <p
              className="text-foreground/60 text-sm mb-4"
              style={{ fontWeight: 300 }}
            >
              Posicione-se e relaxe. Quando terminar, marque como completo.
            </p>
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-2xl border-2 border-secondary/40 text-foreground text-sm font-medium transition-all hover:bg-secondary/10"
            >
              ✓ Completei os {duration} minutos
            </button>
          </motion.div>
        )}

        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <p className="text-lg font-bold text-secondary mb-2">
              🎉 Maravilhoso! Suas pernas agradecem!
            </p>
            <p
              className="text-foreground/60 text-sm"
              style={{ fontWeight: 300 }}
            >
              Você acabou de fazer um dos gestos mais poderosos de autocuidado
              para o Lipedema.
            </p>
          </motion.div>
        )}

        <div className="p-3 bg-green-500/10 rounded-lg mb-4">
          <p
            className="text-foreground/80 text-xs"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            <strong>💡 Por que funciona:</strong> A posição invertida usa a
            gravidade para drenar o líquido acumulado nas pernas de volta para o
            tronco. É como "resetar" o sistema linfático ao final do dia.
          </p>
        </div>

        <div className="glass-card p-4 mb-8 text-center">
          <p
            className="text-foreground/50 text-xs italic"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            💜 <strong>Dica da Lavínia:</strong> Faça deste ritual um momento
            sagrado. Coloque uma música suave, respire fundo e permita que suas
            pernas descansem de verdade.
          </p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/5 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <button
          onClick={() => duration && onContinue(duration)}
          disabled={!completed}
          className={`w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm block transition-all ${
            completed
              ? "gradient-primary text-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          {completed
            ? "Continuar para Diário de Leveza →"
            : "Complete o ritual para continuar"}
        </button>
      </div>
    </div>
  );
};

export default Day5LegsElevation;
