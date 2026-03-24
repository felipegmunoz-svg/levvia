import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Day5MovementGuideProps {
  onContinue: (data: Record<string, boolean>) => void;
}

const CalfRaiseSVG = () => (
  <svg viewBox="0 0 200 300" className="w-48 h-48 mx-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bodyGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2EC4B6" />
        <stop offset="100%" stopColor="#3DD9C8" />
      </linearGradient>
    </defs>
    {/* Head */}
    <ellipse cx="100" cy="38" rx="16" ry="20" fill="url(#bodyGrad1)" />
    {/* Neck */}
    <rect x="94" y="56" width="12" height="12" rx="6" fill="url(#bodyGrad1)" />
    {/* Torso */}
    <path d="M82 68 Q78 90 80 120 Q82 140 88 145 L112 145 Q118 140 120 120 Q122 90 118 68 Z" fill="url(#bodyGrad1)" />
    {/* Left arm */}
    <path d="M82 72 Q68 95 72 120" stroke="#2EC4B6" strokeWidth="8" strokeLinecap="round" fill="none" />
    {/* Right arm */}
    <path d="M118 72 Q132 95 128 120" stroke="#2EC4B6" strokeWidth="8" strokeLinecap="round" fill="none" />
    {/* Hips */}
    <ellipse cx="100" cy="150" rx="22" ry="14" fill="url(#bodyGrad1)" />
    {/* Left thigh */}
    <path d="M86 158 Q82 185 84 210" stroke="#2EC4B6" strokeWidth="14" strokeLinecap="round" fill="none" />
    {/* Right thigh */}
    <path d="M114 158 Q118 185 116 210" stroke="#2EC4B6" strokeWidth="14" strokeLinecap="round" fill="none" />
    {/* Left calf - highlighted */}
    <path d="M84 210 Q80 235 82 258" stroke="#2EC4B6" strokeWidth="11" strokeLinecap="round" fill="none" />
    <path d="M84 210 Q80 235 82 258" stroke="#1B3F6B" strokeWidth="13" strokeLinecap="round" fill="none" opacity="0.15" />
    {/* Right calf - highlighted */}
    <path d="M116 210 Q120 235 118 258" stroke="#2EC4B6" strokeWidth="11" strokeLinecap="round" fill="none" />
    <path d="M116 210 Q120 235 118 258" stroke="#1B3F6B" strokeWidth="13" strokeLinecap="round" fill="none" opacity="0.15" />
    {/* Left foot on toes */}
    <ellipse cx="80" cy="264" rx="10" ry="5" fill="#2EC4B6" />
    {/* Right foot on toes */}
    <ellipse cx="120" cy="264" rx="10" ry="5" fill="#2EC4B6" />
    {/* Ground dots */}
    <line x1="55" y1="272" x2="145" y2="272" stroke="#1B3F6B" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
    {/* Up arrows */}
    <path d="M148 250 L148 220 M142 230 L148 220 L154 230" stroke="#1B3F6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M52 250 L52 220 M46 230 L52 220 L58 230" stroke="#1B3F6B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Label */}
    <text x="100" y="292" fontSize="11" fill="#1B3F6B" fontWeight="600" textAnchor="middle" opacity="0.7">ELEVAR</text>
  </svg>
);

const PlantarFlexionSVG = () => (
  <svg viewBox="0 0 220 240" className="w-48 h-48 mx-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bodyGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2EC4B6" />
        <stop offset="100%" stopColor="#3DD9C8" />
      </linearGradient>
    </defs>
    {/* Chair */}
    <rect x="30" y="90" width="90" height="6" rx="3" fill="#D1D5DB" />
    <rect x="28" y="20" width="6" height="76" rx="3" fill="#D1D5DB" />
    <rect x="34" y="96" width="6" height="80" rx="3" fill="#D1D5DB" />
    <rect x="110" y="96" width="6" height="80" rx="3" fill="#D1D5DB" />
    {/* Head */}
    <ellipse cx="75" cy="32" rx="14" ry="17" fill="url(#bodyGrad2)" />
    {/* Neck */}
    <rect x="70" y="48" width="10" height="8" rx="5" fill="url(#bodyGrad2)" />
    {/* Torso sitting */}
    <path d="M62 56 Q58 72 60 90 L90 90 Q92 72 88 56 Z" fill="url(#bodyGrad2)" />
    {/* Left arm resting */}
    <path d="M62 62 Q50 78 55 92" stroke="#2EC4B6" strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Right arm resting */}
    <path d="M88 62 Q96 78 92 92" stroke="#2EC4B6" strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Thighs on chair */}
    <path d="M65 92 Q80 96 100 94 Q110 93 118 96" stroke="#2EC4B6" strokeWidth="12" strokeLinecap="round" fill="none" />
    {/* Lower leg */}
    <path d="M118 96 Q120 130 119 162" stroke="#2EC4B6" strokeWidth="10" strokeLinecap="round" fill="none" />
    {/* Foot position A - toes up (lighter) */}
    <path d="M119 162 L105 155" stroke="#3DD9C8" strokeWidth="7" strokeLinecap="round" fill="none" />
    {/* Foot position B - toes down (original) */}
    <path d="M119 162 L133 172" stroke="#2EC4B6" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.5" strokeDasharray="4 3" />
    {/* Arrow up (toe) */}
    <path d="M98 160 L94 148 M90 153 L94 148 L98 153" stroke="#1B3F6B" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Arrow down (heel) */}
    <path d="M140 166 L144 178 M140 173 L144 178 L148 173" stroke="#1B3F6B" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Labels */}
    <text x="82" y="146" fontSize="9" fill="#1B3F6B" fontWeight="600" opacity="0.7">PONTA</text>
    <text x="146" y="182" fontSize="9" fill="#1B3F6B" fontWeight="600" opacity="0.7">CALCANHAR</text>
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
