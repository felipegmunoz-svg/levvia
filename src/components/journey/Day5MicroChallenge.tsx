import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface Day5MicroChallengeProps {
  onContinue: () => void;
}

const Day5MicroChallenge = ({ onContinue }: Day5MicroChallengeProps) => {
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
          <span className="text-5xl mb-3 block">🌀</span>
          <h2
            className="text-foreground mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
            }}
          >
            Micro-Desafio da Tarde
          </h2>
          <p
            className="text-foreground/60 text-sm max-w-sm mx-auto"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            Um movimento de 30 segundos que mantém seu fluxo linfático ativo
          </p>
        </div>

        <div className="glass-card p-5 mb-6">
          <h3 className="text-foreground text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">🦶</span>
            Gire os Tornozelos — Onde Você Estiver
          </h3>

          <p
            className="text-foreground/60 text-sm mb-4"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            Seja na mesa do trabalho, no sofá ou na fila do mercado — este
            micro-movimento ativa a circulação das pernas em segundos.
          </p>

          <div className="bg-secondary/10 rounded-lg p-4 mb-4">
            <p className="text-foreground/80 text-sm font-semibold mb-2">
              Como fazer:
            </p>
            <ol className="text-foreground/60 text-sm space-y-2" style={{ fontWeight: 300 }}>
              <li>1. Sente-se confortavelmente ou fique em pé</li>
              <li>2. Levante um pé do chão (se sentada) ou aponte os dedos (se em pé)</li>
              <li>3. Gire o tornozelo 10 vezes no sentido horário ↻</li>
              <li>4. Gire 10 vezes no sentido anti-horário ↺</li>
              <li>5. Troque de perna e repita</li>
            </ol>
          </div>

          <div className="p-3 bg-green-500/10 rounded mb-4">
            <p
              className="text-foreground/80 text-xs"
              style={{ fontWeight: 300, lineHeight: 1.7 }}
            >
              <strong>💡 Por que funciona:</strong> A rotação do tornozelo
              contrai e relaxa os músculos da panturrilha, ativando a "bomba
              linfática" que drena o excesso de líquido das pernas.
            </p>
          </div>

          {!completed && (
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-2xl border-2 border-secondary/40 text-foreground text-sm font-medium transition-all hover:bg-secondary/10"
            >
              ✓ Completei o Micro-Desafio
            </button>
          )}
        </div>

        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <p className="text-lg font-bold text-secondary mb-2">
              🎉 Incrível! Você manteve o fluxo vivo!
            </p>
            <p
              className="text-foreground/60 text-sm"
              style={{ fontWeight: 300 }}
            >
              Mesmo movimentos pequenos fazem grande diferença ao longo do dia.
            </p>
          </motion.div>
        )}

        <div className="glass-card p-4 mb-8 text-center">
          <p
            className="text-foreground/50 text-xs italic"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            💜 <strong>Dica da Lavínia:</strong> Configure um alarme no celular
            para repetir este micro-movimento a cada 2-3 horas. Seus tornozelos
            vão agradecer!
          </p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/5 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <button
          onClick={onContinue}
          disabled={!completed}
          className={`w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm block transition-all ${
            completed
              ? "gradient-primary text-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          {completed
            ? "Continuar para Ritual Noturno →"
            : "Complete o desafio para continuar"}
        </button>
      </div>
    </div>
  );
};

export default Day5MicroChallenge;
