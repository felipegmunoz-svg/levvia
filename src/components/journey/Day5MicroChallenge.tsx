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
          <span className="text-5xl mb-3 block">🏃‍♀️</span>
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
            <span className="text-2xl">🏃‍♀️</span>
            Marcha Parada — Desperte o Fluxo
          </h3>

          <p
            className="text-foreground/60 text-sm mb-4"
            style={{ fontWeight: 300, lineHeight: 1.7 }}
          >
            Seja na sala, no escritório ou na cozinha — este movimento simples
            ativa não só as panturrilhas, mas também os linfonodos da virilha,
            os grandes "ralos" de drenagem das pernas.
          </p>

          <div className="bg-secondary/10 rounded-lg p-4 mb-4">
            <p className="text-foreground/80 text-sm font-semibold mb-2">
              Como fazer:
            </p>
            <ol className="text-foreground/60 text-sm space-y-2" style={{ fontWeight: 300 }}>
              <li>1. Fique em pé, com os pés paralelos na largura dos quadris</li>
              <li>2. Levante o joelho direito em direção ao peito</li>
              <li>3. Abaixe e levante o joelho esquerdo</li>
              <li>4. Continue alternando em ritmo moderado</li>
              <li>5. Complete 20 repetições no total (10 cada perna)</li>
            </ol>
          </div>

          <div className="bg-accent/30 rounded-lg p-4 mb-4">
            <p className="text-foreground/80 text-sm font-semibold mb-2">
              ⚠️ Adaptações se necessário:
            </p>
            <ul className="text-foreground/60 text-sm space-y-2" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              <li>• Se sentir desequilíbrio: Apoie-se em uma parede ou cadeira</li>
              <li>• Se houver dor: Levante os joelhos apenas até onde for confortável (não precisa chegar ao peito)</li>
              <li>• Se mobilidade limitada: Faça sentada (marche com os pés no ar)</li>
              <li>• Se estiver cansada: Reduza para 10 repetições (5 cada perna)</li>
            </ul>
            <p
              className="text-foreground/50 text-xs mt-3 italic"
              style={{ fontWeight: 300, lineHeight: 1.7 }}
            >
              Movimento eficaz é movimento que você consegue fazer sem dor.
              Respeite os limites do seu corpo hoje.
            </p>
          </div>

          <div className="p-3 bg-green-500/10 rounded mb-4">
            <p
              className="text-foreground/80 text-xs"
              style={{ fontWeight: 300, lineHeight: 1.7 }}
            >
              <strong>💡 Por que funciona:</strong> A marcha é um movimento{" "}
              <em>cíclico</em> — a repetição rítmica contrai e relaxa
              os músculos da panturrilha e da coxa, ativando a "bomba linfática"
              que drena o excesso de líquido. Ao elevar os joelhos, você também
              mobiliza os linfonodos da virilha, os principais "ralos" de drenagem
              das pernas. É terapia de drenagem ativa, não apenas exercício.
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
            💜 <strong>Dica da Lavínia:</strong> Querida, vamos dar um "sacode"
            no sistema? Levante os joelhos agora, como se estivesse marchando
            no lugar. Sinta o sangue e a linfa subindo. Suas pernas vão
            agradecer esse despertar!
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
