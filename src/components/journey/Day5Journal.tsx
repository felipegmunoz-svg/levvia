import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Day5JournalProps {
  onContinue: (data: { legsSensation: string; energyLevel: string; notes?: string }) => void;
}

const legsSensations = [
  { value: "mais_pesadas", label: "Mais Pesadas", emoji: "😟" },
  { value: "igual", label: "Igual", emoji: "😐" },
  { value: "mais_leves", label: "Mais Leves", emoji: "😊" },
  { value: "muito_mais_leves", label: "Muito Mais Leves", emoji: "🤩" },
];

const energyLevels = [
  { value: "baixo", label: "Baixo", emoji: "😴" },
  { value: "moderado", label: "Moderado", emoji: "😌" },
  { value: "bom", label: "Bom", emoji: "😊" },
  { value: "excelente", label: "Excelente", emoji: "⚡" },
];

const Day5Journal = ({ onContinue }: Day5JournalProps) => {
  const [legsSensation, setLegsSensation] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const canContinue = legsSensation && energyLevel;

  const handleLegsSensationChange = (value: string) => {
    setLegsSensation(value);

    if (value === "muito_mais_leves") {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#2EC4B6", "#1B3F6B", "#2E86AB"],
        disableForReducedMotion: true,
      });
    }
  };

  const handleContinue = () => {
    if (!legsSensation || !energyLevel) return;
    onContinue({ legsSensation, energyLevel, notes: notes || undefined });
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Seu Diário de Leveza</h2>

        <p className="text-sm text-muted-foreground mb-6">
          Após realizar os exercícios, registre como suas pernas se sentiram
          e qual o seu nível de energia. Cada registro é um passo no seu mapa de desinflamação.
        </p>

        {/* Sensação nas Pernas */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-foreground">
            Sensação nas Pernas após o Movimento:
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {legsSensations.map((option) => (
              <div
                key={option.value}
                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                  legsSensation === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                }`}
                onClick={() => handleLegsSensationChange(option.value)}
              >
                <span className="text-3xl block mb-2">{option.emoji}</span>
                <p className="text-sm font-medium text-foreground">{option.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Celebration for "Muito Mais Leves" */}
        {legsSensation === "muito_mais_leves" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="p-4 bg-green-500/10 rounded-lg mb-6 border-2 border-green-500/30"
          >
            <p className="text-green-600 font-semibold text-center">
              ✨ Que vitória incrível! Suas pernas estão fluindo como nunca.
              O movimento está te libertando! 🎉
            </p>
          </motion.div>
        )}

        {/* Nível de Energia */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-foreground">Nível de Energia:</h3>
          <div className="grid grid-cols-2 gap-3">
            {energyLevels.map((option) => (
              <div
                key={option.value}
                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                  energyLevel === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                }`}
                onClick={() => setEnergyLevel(option.value)}
              >
                <span className="text-3xl block mb-2">{option.emoji}</span>
                <p className="text-sm font-medium text-foreground">{option.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-foreground">Observações (opcional):</h3>
          <Textarea
            rows={4}
            placeholder="Como você se sentiu durante os exercícios? Alguma observação importante..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="fixed bottom-[68px] left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/30 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <Button onClick={handleContinue} disabled={!canContinue} className="w-full">
          {canContinue ? "Salvar Registro →" : "Preencha sensação e energia para continuar"}
        </Button>
      </div>
    </div>
  );
};

export default Day5Journal;
