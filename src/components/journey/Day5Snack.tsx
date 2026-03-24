import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Day5SnackProps {
  onContinue: () => void;
}

const Day5Snack = ({ onContinue }: Day5SnackProps) => {
  return (
    <div className="min-h-screen bg-background p-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-foreground">Sua Refeição de Fluxo</h2>

        <p className="text-sm text-muted-foreground mb-6">
          Para apoiar o movimento do seu corpo, um lanche nutritivo e fácil de digerir
          é essencial. Ele fornecerá energia limpa sem sobrecarregar seu sistema.
        </p>

        <div className="border-2 border-green-500/20 rounded-lg p-6 mb-6 bg-card">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">🥤</span>
            <div>
              <h3 className="text-xl font-bold text-foreground">Smoothie Verde Detox</h3>
              <p className="text-sm text-muted-foreground">com Abacaxi e Hortelã</p>
            </div>
          </div>

          <div className="text-center text-6xl mb-4">🍹</div>

          <div className="p-3 bg-green-500/10 rounded mb-4">
            <p className="text-sm text-foreground">
              <strong>💡 Benefício:</strong> O abacaxi contém bromelina,
              uma enzima que auxilia na digestão e tem propriedades anti-inflamatórias,
              enquanto a hortelã refresca e facilita o fluxo.
            </p>
          </div>

          <p className="text-sm text-foreground font-semibold mb-2">Ingredientes:</p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-4">
            <li>• 1 xícara de abacaxi picado</li>
            <li>• 1 xícara de espinafre fresco</li>
            <li>• 1/2 pepino</li>
            <li>• 1 ramo de hortelã</li>
            <li>• 1 colher de sopa de linhaça</li>
            <li>• 200ml de água de coco</li>
          </ul>

          <p className="text-sm text-foreground font-semibold mb-2">Modo de preparo:</p>
          <p className="text-sm text-muted-foreground">
            Bata todos os ingredientes no liquidificador até ficar homogêneo.
            Beba fresco, de preferência logo após o preparo.
          </p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/30 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <Button onClick={onContinue} className="w-full">
          Continuar para Diário de Leveza →
        </Button>
      </div>
    </div>
  );
};

export default Day5Snack;
