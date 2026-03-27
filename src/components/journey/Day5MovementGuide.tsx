import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Day5MovementGuideProps {
  onContinue: (data: Record<string, boolean>) => void;
}

const exercises = [
  {
    id: "elevacaoCalcanhares",
    title: "Elevação de Calcanhares",
    subtitle: "Em Pé",
    icon: "👣",
    illustrationUrl: "/illustrations/calf-raise-3d.png",
    instructions:
      "Em pé, com os pés paralelos e o corpo ereto, eleve os calcanhares do chão, ficando na ponta dos pés. Sinta a contração nas panturrilhas. Desça lentamente. Repita 10 vezes.",
    reps: "10 repetições",
  },
  {
    id: "flexaoPlantar",
    title: "Flexão Plantar e Dorsal",
    subtitle: "Sentada",
    icon: "🪑",
    illustrationUrl: "/illustrations/plantar-flexion-3d.png",
    instructions:
      "Sentada, com os pés no chão, alterne entre levantar a ponta dos pés (mantendo os calcanhares no chão) e levantar os calcanhares (mantendo as pontas dos pés no chão). Faça 10 repetições de cada movimento.",
    reps: "10 repetições de cada",
  },
  {
    id: "rotacaoTornozelos",
    title: "Rotação de Tornozelos",
    subtitle: "Deitada ou Sentada",
    icon: "🔄",
    illustrationUrl: "/illustrations/ankle-rotation-3d.png",
    instructions:
      "Deitada ou sentada, eleve uma perna e gire o tornozelo em círculos, 10 vezes para cada lado. Troque de perna. Isso ajuda a lubrificar as articulações e ativar a circulação local.",
    reps: "10 vezes cada lado, 2 pernas",
  },
];

const Day5MovementGuide = ({ onContinue }: Day5MovementGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    elevacaoCalcanhares: false,
    flexaoPlantar: false,
    rotacaoTornozelos: false,
  });

  const currentExercise = exercises[currentStep];

  const handleMarkComplete = () => {
    setCompleted({ ...completed, [currentExercise.id]: true });
  };

  const handleNext = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onContinue(completed);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-28">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Sua Missão de Fluxo</h2>

      <p className="text-sm text-muted-foreground mb-6">
        Suas panturrilhas são o "segundo coração" do seu sistema linfático.
        Ativá-las regularmente pode fazer uma diferença enorme na drenagem
        e na sensação de leveza.
      </p>

      {/* Progress dots */}
      <div className="flex items-center justify-center mb-6 space-x-2">
        {exercises.map((ex, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === currentStep
                ? "bg-primary"
                : completed[ex.id]
                ? "bg-green-500"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Exercise card */}
      <motion.div
        key={currentExercise.id}
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="border-2 border-primary/20 rounded-lg p-6 mb-6 bg-card"
      >
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-3">{currentExercise.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-foreground">{currentExercise.title}</h3>
            <p className="text-sm text-muted-foreground">{currentExercise.subtitle}</p>
          </div>
        </div>

        <div className="mb-4 flex justify-center">
          <img
            src={currentExercise.illustrationUrl}
            alt={currentExercise.title}
            className="w-64 h-64 object-contain rounded-lg"
            loading="lazy"
          />
        </div>

        <p className="text-sm text-muted-foreground mb-4">{currentExercise.instructions}</p>

        <div className="p-3 bg-secondary/10 rounded text-center">
          <p className="text-sm font-semibold text-secondary">📊 {currentExercise.reps}</p>
        </div>
      </motion.div>

      {!completed[currentExercise.id] ? (
        <Button onClick={handleMarkComplete} variant="outline" className="w-full mb-3">
          ✅ Completei Este Exercício
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-3 text-center"
        >
          <p className="text-green-600 font-semibold">
            ✨ Exercício completo! Suas panturrilhas agradecem.
          </p>
        </motion.div>
      )}

      <div className="fixed bottom-[68px] left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/30 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <Button onClick={handleNext} className="w-full" disabled={!completed[currentExercise.id]}>
          {currentStep < exercises.length - 1 ? "Próximo Exercício →" : "Continuar →"}
        </Button>
      </div>
    </div>
  );
};

export default Day5MovementGuide;
