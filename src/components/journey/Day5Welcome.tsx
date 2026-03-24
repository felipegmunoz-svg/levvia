import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Day5WelcomeProps {
  onContinue: () => void;
}

const Day5Welcome = ({ onContinue }: Day5WelcomeProps) => {
  return (
    <div className="min-h-screen bg-background p-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-6">
          <span className="text-6xl">🏃‍♀️</span>
        </div>

        <h1 className="text-2xl font-semibold mb-2 text-primary">
          DIA 5 — MOVIMENTO SEM DOR
        </h1>

        <p className="text-lg text-muted-foreground mb-6">
          Desbloqueie o Fluxo do Seu Corpo
        </p>

        <div className="p-4 bg-secondary/10 rounded-lg mb-6">
          <p className="text-base italic text-foreground">
            "Meu corpo foi feito para fluir.
            Movimento não é punição — é celebração de vida."
          </p>
        </div>

        <div className="text-left space-y-4 text-sm text-muted-foreground mb-8">
          <p>
            <strong className="text-foreground">Seu Corpo Foi Feito Para Fluir:</strong>{" "}
            Redefinindo o Exercício.
          </p>

          <p>
            Para a mulher com Lipedema, a ideia de "exercício" pode evocar imagens
            de dor e frustração. Mas o movimento que seu corpo precisa não é sobre
            exaustão; é sobre <strong className="text-foreground">fluxo</strong>.
          </p>

          <p>
            O sistema linfático não tem uma "bomba" como o coração.
            Ele depende do movimento muscular para funcionar.
            Por isso, o movimento gentil é seu grande aliado para reduzir inchaço.
          </p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/30 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <Button onClick={onContinue} className="w-full">
          Ativar Minha Bomba Linfática →
        </Button>
      </div>
    </div>
  );
};

export default Day5Welcome;
