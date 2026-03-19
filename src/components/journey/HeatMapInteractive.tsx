import { useState } from "react";
import { motion } from "framer-motion";

interface HeatMapInteractiveProps {
  onNext: (heatMap: Record<string, number>) => void;
}

type AreaId =
  | "panturrilha_esq"
  | "panturrilha_dir"
  | "coxa_esq"
  | "coxa_dir"
  | "quadril_esq"
  | "quadril_dir"
  | "abdomen"
  | "braco_esq"
  | "braco_dir";

const areaLabels: Record<AreaId, string> = {
  panturrilha_esq: "Panturrilha E",
  panturrilha_dir: "Panturrilha D",
  coxa_esq: "Coxa E",
  coxa_dir: "Coxa D",
  quadril_esq: "Quadril E",
  quadril_dir: "Quadril D",
  abdomen: "Abdômen",
  braco_esq: "Braço E",
  braco_dir: "Braço D",
};

const intensityColors: Record<number, string> = {
  0: "rgba(237,242,247,0.08)",
  1: "rgba(244,165,53,0.4)",
  2: "rgba(244,165,53,0.75)",
  3: "rgba(198,40,40,0.85)",
};

const HeatMapInteractive = ({ onNext }: HeatMapInteractiveProps) => {
  const [areas, setAreas] = useState<Record<AreaId, number>>({
    panturrilha_esq: 0,
    panturrilha_dir: 0,
    coxa_esq: 0,
    coxa_dir: 0,
    quadril_esq: 0,
    quadril_dir: 0,
    abdomen: 0,
    braco_esq: 0,
    braco_dir: 0,
  });

  const toggleArea = (id: AreaId) => {
    setAreas((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % 4,
    }));
  };

  const handleSubmit = () => {
    onNext({ ...areas, created_at: new Date().toISOString() } as any);
  };

  // SVG silhouette with clickable areas
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-foreground text-center mb-2"
        style={{ fontWeight: 500, fontSize: "1.1rem" }}
      >
        Onde está o seu fogo interno?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-foreground/60 text-center mb-8 max-w-sm"
        style={{ fontWeight: 300, fontSize: "0.9rem" }}
      >
        Toque nas áreas onde você sente mais dor, inchaço ou desconforto. Toque
        novamente para aumentar a intensidade.
      </motion.p>

      {/* Silhouette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative w-[200px] max-w-full"
        style={{ height: "380px" }}
      >
        <svg
          viewBox="0 0 200 400"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body outline */}
          <ellipse cx="100" cy="42" rx="22" ry="28" fill="rgba(237,242,247,0.15)" stroke="rgba(237,242,247,0.3)" strokeWidth="1" />
          {/* Neck */}
          <rect x="92" y="68" width="16" height="14" rx="4" fill="rgba(237,242,247,0.15)" stroke="rgba(237,242,247,0.3)" strokeWidth="1" />
          {/* Torso */}
          <path d="M72 82 L128 82 L132 180 L68 180 Z" fill="rgba(237,242,247,0.15)" stroke="rgba(237,242,247,0.3)" strokeWidth="1" />

          {/* Left Arm */}
          <path
            d="M72 85 L52 90 L42 150 L48 152 L60 95 L72 92"
            fill={intensityColors[areas.braco_esq]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("braco_esq")}
            className="cursor-pointer transition-all duration-200"
          />
          {/* Right Arm */}
          <path
            d="M128 85 L148 90 L158 150 L152 152 L140 95 L128 92"
            fill={intensityColors[areas.braco_dir]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("braco_dir")}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Abdomen */}
          <rect
            x="78" y="120" width="44" height="50" rx="6"
            fill={intensityColors[areas.abdomen]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("abdomen")}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Left Hip */}
          <path
            d="M68 175 L80 175 L78 210 L65 210 Z"
            fill={intensityColors[areas.quadril_esq]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("quadril_esq")}
            className="cursor-pointer transition-all duration-200"
          />
          {/* Right Hip */}
          <path
            d="M120 175 L132 175 L135 210 L122 210 Z"
            fill={intensityColors[areas.quadril_dir]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("quadril_dir")}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Left Thigh */}
          <path
            d="M65 212 L80 212 L76 290 L68 290 Z"
            fill={intensityColors[areas.coxa_esq]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("coxa_esq")}
            className="cursor-pointer transition-all duration-200"
          />
          {/* Right Thigh */}
          <path
            d="M120 212 L135 212 L132 290 L124 290 Z"
            fill={intensityColors[areas.coxa_dir]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("coxa_dir")}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Left Calf */}
          <path
            d="M68 292 L76 292 L74 370 L70 370 Z"
            fill={intensityColors[areas.panturrilha_esq]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("panturrilha_esq")}
            className="cursor-pointer transition-all duration-200"
          />
          {/* Right Calf */}
          <path
            d="M124 292 L132 292 L130 370 L126 370 Z"
            fill={intensityColors[areas.panturrilha_dir]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("panturrilha_dir")}
            className="cursor-pointer transition-all duration-200"
          />
        </svg>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-foreground/70">
          <span className="w-3 h-3 rounded-full" style={{ background: "rgba(244,165,53,0.5)" }} />
          Leve
        </span>
        <span className="flex items-center gap-1.5 text-xs text-foreground/70">
          <span className="w-3 h-3 rounded-full" style={{ background: "rgba(244,165,53,0.85)" }} />
          Moderado
        </span>
        <span className="flex items-center gap-1.5 text-xs text-foreground/70">
          <span className="w-3 h-3 rounded-full" style={{ background: "rgba(198,40,40,0.85)" }} />
          Intenso
        </span>
      </div>

      {/* Instruction */}
      <p
        className="text-foreground/50 text-center italic mb-8 max-w-xs"
        style={{ fontWeight: 300, fontSize: "0.85rem" }}
      >
        Seja honesta consigo mesma. Este é o seu mapa para a leveza.
      </p>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        className="w-full max-w-xs py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
      >
        Este é o meu mapa de fogo →
      </button>
    </div>
  );
};

export default HeatMapInteractive;
