import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Day5ClosingProps {
  onComplete: () => void;
}

const Day5Closing = ({ onComplete }: Day5ClosingProps) => {
  return (
    <div className="min-h-screen bg-background p-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="text-6xl mb-4 block">✨</span>

        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Parabéns! Dia 5 Completo
        </h2>

        <p className="text-sm text-muted-foreground mb-6">
          Você está aprendendo a ouvir e a cuidar do seu corpo com sabedoria.
          Movimento gentil é autocuidado, não punição.
        </p>

        <div className="p-4 bg-secondary/10 rounded-lg mb-6 text-left">
          <h3 className="font-semibold mb-2 text-foreground">Suas Conquistas:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>✅ Dia 1: Mapeou seu Fogo Interno</li>
            <li>✅ Dia 2: Sentiu alívio com drenagem linfática</li>
            <li>✅ Dia 3: Ganhou clareza nutricional</li>
            <li>✅ Dia 4: Preparou ritual de sono restaurador</li>
            <li>✅ Dia 5: Desbloqueou o fluxo linfático com movimento gentil</li>
          </ul>
        </div>

        <div className="p-4 bg-purple-500/10 rounded-lg mb-6">
          <p className="text-sm text-foreground">
            💜 <strong>Amanhã:</strong> Dia 6 — O Poder das Especiarias
            <br />
            <span className="text-muted-foreground">
              Prepare-se para um "shot" de sabor e saúde.
              Você vai descobrir aliadas secretas na luta contra a inflamação.
            </span>
          </p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/30 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <Button onClick={onComplete} className="w-full">
          Ver Resumo do Dia →
        </Button>
      </div>
    </div>
  );
};

export default Day5Closing;
