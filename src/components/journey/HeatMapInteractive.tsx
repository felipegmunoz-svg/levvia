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
          viewBox="0 0 220 440"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body outline - feminine silhouette */}
          {/* Head */}
          <ellipse cx="110" cy="38" rx="20" ry="25" fill="rgba(237,242,247,0.12)" stroke="rgba(237,242,247,0.3)" strokeWidth="1.2" />
          {/* Neck */}
          <path d="M102 62 Q102 70 100 75 L120 75 Q118 70 118 62" fill="rgba(237,242,247,0.12)" stroke="rgba(237,242,247,0.3)" strokeWidth="1.2" />
          {/* Shoulders & upper torso */}
          <path
            d="M100 75 Q82 78 68 88 Q60 94 58 105 L58 120 Q58 125 60 128
               L60 128 Q72 130 80 130
               L80 130 L80 120
               Q85 108 100 105 L120 105 Q135 108 140 120
               L140 130 Q148 130 160 128
               L160 128 Q162 125 162 120 L162 105 Q160 94 152 88 Q138 78 120 75 Z"
            fill="rgba(237,242,247,0.12)" stroke="rgba(237,242,247,0.3)" strokeWidth="1.2"
          />
          {/* Torso - waist & hips curves */}
          <path
            d="M80 130 Q78 145 76 155 Q74 165 72 172
               Q68 182 65 192 Q62 202 62 210
               L158 210 Q158 202 155 192 Q152 182 148 172
               Q146 165 144 155 Q142 145 140 130 Z"
            fill="rgba(237,242,247,0.12)" stroke="rgba(237,242,247,0.3)" strokeWidth="1.2"
          />
          {/* Legs outline */}
          <path
            d="M62 210 Q64 220 66 230 L66 310 Q66 315 68 320 L68 370 Q68 378 72 385 L72 400 Q72 408 78 412 L92 412 Q96 408 96 400 L96 385 Q98 378 98 370 L98 320 Q100 315 100 310 L100 230 Q102 220 104 210"
            fill="rgba(237,242,247,0.08)" stroke="rgba(237,242,247,0.3)" strokeWidth="1.2"
          />
          <path
            d="M116 210 Q118 220 120 230 L120 310 Q120 315 122 320 L122 370 Q122 378 124 385 L124 400 Q124 408 128 412 L142 412 Q146 408 146 400 L146 385 Q148 378 148 370 L148 320 Q150 315 150 310 L150 230 Q152 220 158 210"
            fill="rgba(237,242,247,0.08)" stroke="rgba(237,242,247,0.3)" strokeWidth="1.2"
          />

          {/* === CLICKABLE AREAS === */}

          {/* Left Arm */}
          <path
            d="M68 88 Q60 94 56 108 L52 135 Q48 155 46 170 L42 168 Q44 150 48 130 L52 105 Q56 92 65 85 Z"
            fill={intensityColors[areas.braco_esq]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("braco_esq")}
            className="cursor-pointer transition-all duration-200"
          />
          {/* Right Arm */}
          <path
            d="M152 88 Q160 94 164 108 L168 135 Q172 155 174 170 L178 168 Q176 150 172 130 L168 105 Q164 92 155 85 Z"
            fill={intensityColors[areas.braco_dir]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("braco_dir")}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Abdomen */}
          <rect
            x="82" y="130" width="56" height="50" rx="8"
            fill={intensityColors[areas.abdomen]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("abdomen")}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Left Hip / Quadril */}
          <path
            d="M66 182 Q64 192 62 205 L62 212 L98 212 L98 205 Q96 192 94 182 Z"
            fill={intensityColors[areas.quadril_esq]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("quadril_esq")}
            className="cursor-pointer transition-all duration-200"
          />
          {/* Right Hip / Quadril */}
          <path
            d="M126 182 Q128 192 130 205 L130 212 L158 212 L158 205 Q156 192 154 182 Z"
            fill={intensityColors[areas.quadril_dir]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("quadril_dir")}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Left Thigh / Coxa */}
          <path
            d="M64 214 L98 214 L98 310 Q96 312 94 314 L68 314 Q66 312 64 310 Z"
            fill={intensityColors[areas.coxa_esq]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("coxa_esq")}
            className="cursor-pointer transition-all duration-200"
          />
          {/* Right Thigh / Coxa */}
          <path
            d="M122 214 L156 214 L156 310 Q154 312 152 314 L124 314 Q122 312 120 310 Z"
            fill={intensityColors[areas.coxa_dir]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("coxa_dir")}
            className="cursor-pointer transition-all duration-200"
          />

          {/* Left Calf / Panturrilha */}
          <path
            d="M66 316 L96 316 L96 380 Q94 385 92 388 L72 388 Q70 385 68 380 Z"
            fill={intensityColors[areas.panturrilha_esq]}
            stroke="rgba(237,242,247,0.3)"
            strokeWidth="1"
            onClick={() => toggleArea("panturrilha_esq")}
            className="cursor-pointer transition-all duration-200"
          />
          {/* Right Calf / Panturrilha */}
          <path
            d="M124 316 L154 316 L154 380 Q152 385 150 388 L128 388 Q126 385 124 380 Z"
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
