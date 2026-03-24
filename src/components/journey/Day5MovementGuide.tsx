import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Day5MovementGuideProps {
  onContinue: (data: Record<string, boolean>) => void;
}

const CalfRaiseSVG = () => (
  <svg viewBox="0 0 200 280" className="w-48 h-48 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ground line */}
    <line x1="40" y1="260" x2="160" y2="260" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="4 4" />
    {/* Left leg */}
    <line x1="85" y1="120" x2="80" y2="200" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    <line x1="80" y1="200" x2="82" y2="240" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Left foot (on toes) */}
    <line x1="82" y1="240" x2="75" y2="252" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    <circle cx="75" cy="252" r="3" fill="hsl(var(--primary))" />
    {/* Right leg */}
    <line x1="115" y1="120" x2="120" y2="200" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    <line x1="120" y1="200" x2="118" y2="240" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Right foot (on toes) */}
    <line x1="118" y1="240" x2="125" y2="252" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    <circle cx="125" cy="252" r="3" fill="hsl(var(--primary))" />
    {/* Torso */}
    <line x1="100" y1="60" x2="100" y2="120" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Head */}
    <circle cx="100" cy="45" r="15" stroke="hsl(var(--primary))" strokeWidth="2.5" fill="hsl(var(--primary) / 0.1)" />
    {/* Arms */}
    <line x1="100" y1="75" x2="70" y2="100" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="100" y1="75" x2="130" y2="100" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
    {/* Hips */}
    <line x1="85" y1="120" x2="115" y2="120" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Up arrows */}
    <path d="M150 220 L150 180 L142 192 M150 180 L158 192" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <text x="155" y="210" fontSize="10" fill="hsl(var(--secondary))" fontWeight="600">SUBA</text>
    {/* Calf highlight */}
    <ellipse cx="80" cy="215" rx="8" ry="18" fill="hsl(var(--secondary) / 0.15)" stroke="hsl(var(--secondary))" strokeWidth="1" strokeDasharray="3 3" />
    <ellipse cx="120" cy="215" rx="8" ry="18" fill="hsl(var(--secondary) / 0.15)" stroke="hsl(var(--secondary))" strokeWidth="1" strokeDasharray="3 3" />
  </svg>
);

const PlantarFlexionSVG = () => (
  <svg viewBox="0 0 200 240" className="w-48 h-48 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Chair */}
    <rect x="50" y="80" width="100" height="8" rx="2" fill="hsl(var(--muted-foreground) / 0.3)" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
    <line x1="55" y1="88" x2="55" y2="220" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
    <line x1="145" y1="88" x2="145" y2="220" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
    {/* Back */}
    <line x1="50" y1="20" x2="50" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
    {/* Torso sitting */}
    <line x1="85" y1="30" x2="85" y2="85" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Head */}
    <circle cx="85" cy="18" r="12" stroke="hsl(var(--primary))" strokeWidth="2.5" fill="hsl(var(--primary) / 0.1)" />
    {/* Thigh */}
    <line x1="85" y1="85" x2="120" y2="88" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Lower leg */}
    <line x1="120" y1="88" x2="122" y2="160" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Foot pointing up */}
    <line x1="122" y1="160" x2="110" y2="155" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Foot pointing down (ghost) */}
    <line x1="122" y1="160" x2="135" y2="175" stroke="hsl(var(--primary) / 0.3)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
    {/* Arrows */}
    <path d="M105 145 L100 135 M105 145 L112 138" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" />
    <path d="M140 170 L145 180 M140 170 L133 177" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" />
    {/* Labels */}
    <text x="85" y="135" fontSize="9" fill="hsl(var(--secondary))" fontWeight="600">PONTA</text>
    <text x="130" y="195" fontSize="9" fill="hsl(var(--secondary))" fontWeight="600">CALCANHAR</text>
  </svg>
);

const AnkleRotationSVG = () => (
  <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Leg elevated */}
    <line x1="40" y1="60" x2="100" y2="70" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    <line x1="100" y1="70" x2="140" y2="80" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Ankle joint */}
    <circle cx="140" cy="80" r="5" fill="hsl(var(--secondary))" />
    {/* Foot */}
    <line x1="140" y1="80" x2="165" y2="90" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
    {/* Rotation circle around ankle */}
    <circle cx="140" cy="80" r="30" stroke="hsl(var(--secondary))" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
    {/* Rotation arrow */}
    <path d="M170 80 Q175 65 165 55" stroke="hsl(var(--secondary))" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M165 55 L170 62 M165 55 L158 58" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" />
    {/* Second rotation arrow */}
    <path d="M110 80 Q105 95 115 105" stroke="hsl(var(--secondary))" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M115 105 L110 98 M115 105 L122 102" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" />
    {/* Label */}
    <text x="120" y="130" fontSize="10" fill="hsl(var(--secondary))" fontWeight="600" textAnchor="middle">GIRE</text>
    {/* Support surface */}
    <rect x="10" y="55" width="40" height="10" rx="3" fill="hsl(var(--muted-foreground) / 0.2)" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
  </svg>
);

const exercises = [
  {
    id: "elevacaoCalcanhares",
    title: "Elevação de Calcanhares",
    subtitle: "Em Pé",
    icon: "👣",
    Illustration: CalfRaiseSVG,
    instructions:
      "Em pé, com os pés paralelos e o corpo ereto, eleve os calcanhares do chão, ficando na ponta dos pés. Sinta a contração nas panturrilhas. Desça lentamente. Repita 10 vezes.",
    reps: "10 repetições",
  },
  {
    id: "flexaoPlantar",
    title: "Flexão Plantar e Dorsal",
    subtitle: "Sentada",
    icon: "🪑",
    Illustration: PlantarFlexionSVG,
    instructions:
      "Sentada, com os pés no chão, alterne entre levantar a ponta dos pés (mantendo os calcanhares no chão) e levantar os calcanhares (mantendo as pontas dos pés no chão). Faça 10 repetições de cada movimento.",
    reps: "10 repetições de cada",
  },
  {
    id: "rotacaoTornozelos",
    title: "Rotação de Tornozelos",
    subtitle: "Deitada ou Sentada",
    icon: "🔄",
    Illustration: AnkleRotationSVG,
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
  const ExIllustration = currentExercise.Illustration;

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

        <div className="mb-4">
          <ExIllustration />
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/30 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <Button onClick={handleNext} className="w-full" disabled={!completed[currentExercise.id]}>
          {currentStep < exercises.length - 1 ? "Próximo Exercício →" : "Continuar →"}
        </Button>
      </div>
    </div>
  );
};

export default Day5MovementGuide;
