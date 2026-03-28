import { useState } from "react";
import { motion } from "framer-motion";

interface HeatMapInteractiveProps {
  onNext?: (heatMap: Record<string, number | string>) => void;
  initialData?: Partial<Record<AreaId, number>> | null;
  readOnly?: boolean;
  size?: "small" | "normal";
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

export const areaLabels: Record<AreaId, string> = {
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
  0: "rgba(140,160,180,0.15)",
  1: "rgba(244,165,53,0.4)",
  2: "rgba(244,165,53,0.75)",
  3: "rgba(198,40,40,0.85)",
};

const defaultAreas: Record<AreaId, number> = {
  panturrilha_esq: 0,
  panturrilha_dir: 0,
  coxa_esq: 0,
  coxa_dir: 0,
  quadril_esq: 0,
  quadril_dir: 0,
  abdomen: 0,
  braco_esq: 0,
  braco_dir: 0,
};

const HeatMapInteractive = ({
  onNext,
  initialData,
  readOnly = false,
  size = "normal",
}: HeatMapInteractiveProps) => {
  const [areas, setAreas] = useState<Record<AreaId, number>>({
    ...defaultAreas,
    ...(initialData || {}),
  });

  const hasSelection = Object.values(areas).some((value) => value > 0);
  const silhouetteWidth = size === "small" ? "w-[160px]" : "w-[200px]";
  const silhouetteHeight = size === "small" ? "300px" : "380px";

  const toggleArea = (id: AreaId) => {
    if (readOnly) return;
    setAreas((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % 4,
    }));
  };

  const handleSubmit = () => {
    if (!onNext || !hasSelection || readOnly) return;
    onNext({ ...areas, created_at: new Date().toISOString() });
  };

  return (
    <div className={`w-full flex flex-col items-center px-6 ${readOnly ? "py-6" : "py-6"}`}>
      {!readOnly && (
        <>
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
            className="text-foreground/60 text-center mb-2 max-w-sm"
            style={{ fontWeight: 300, fontSize: "0.9rem" }}
          >
            Toque nas áreas onde você sente mais dor, inchaço ou desconforto.
          </motion.p>
          <div className="flex flex-col items-center gap-1 mb-8 text-xs text-foreground/50" style={{ fontWeight: 300 }}>
            <span>Toque uma vez para dor leve (Amarelo)</span>
            <span>Toque duas vezes para dor moderada (Laranja)</span>
            <span>Toque três vezes para dor intensa (Vermelho)</span>
          </div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`relative ${silhouetteWidth} max-w-full`}
        style={{ height: silhouetteHeight }}
      >
        <svg
          viewBox="0 0 220 440"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="110" cy="38" rx="20" ry="25" fill="rgba(140,160,180,0.15)" stroke="rgba(140,160,180,0.4)" strokeWidth="1.2" />
          <rect x="102" y="58" width="16" height="18" rx="4" fill="rgba(140,160,180,0.15)" stroke="rgba(140,160,180,0.4)" strokeWidth="1.2" />
          <ellipse cx="40" cy="225" rx="8" ry="10" fill="rgba(140,160,180,0.15)" stroke="rgba(140,160,180,0.4)" strokeWidth="1" />
          <ellipse cx="180" cy="225" rx="8" ry="10" fill="rgba(140,160,180,0.15)" stroke="rgba(140,160,180,0.4)" strokeWidth="1" />
          <path d="M68 390 Q66 400 64 406 Q62 412 66 414 L90 414 Q94 412 94 406 Q94 400 92 390 Z" fill="rgba(140,160,180,0.15)" stroke="rgba(140,160,180,0.4)" strokeWidth="1" />
          <path d="M128 390 Q126 400 126 406 Q126 412 130 414 L154 414 Q158 412 156 406 Q156 400 152 390 Z" fill="rgba(140,160,180,0.15)" stroke="rgba(140,160,180,0.4)" strokeWidth="1" />
          <path d="M68 78 Q56 84 48 100 Q42 116 38 140 Q34 165 34 190 Q33 205 36 215 L52 215 Q54 205 54 190 Q54 165 58 140 Q62 116 66 100 Q70 90 78 82 Z" fill={intensityColors[areas.braco_esq]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("braco_esq")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
          <path d="M152 78 Q164 84 172 100 Q178 116 182 140 Q186 165 186 190 Q187 205 184 215 L168 215 Q166 205 166 190 Q166 165 162 140 Q158 116 154 100 Q150 90 142 82 Z" fill={intensityColors[areas.braco_dir]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("braco_dir")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
          <path d="M78 76 Q90 74 110 74 Q130 74 142 76 Q150 80 154 90 Q158 100 158 110 Q156 130 152 145 Q148 158 142 170 Q136 178 130 180 L90 180 Q84 178 78 170 Q72 158 68 145 Q64 130 62 110 Q62 100 66 90 Q70 80 78 76 Z" fill={intensityColors[areas.abdomen]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("abdomen")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
          <path d="M90 180 Q84 182 78 186 Q70 192 66 200 Q62 208 60 216 L104 216 L104 200 Q102 192 98 186 Q96 182 90 180 Z" fill={intensityColors[areas.quadril_esq]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("quadril_esq")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
          <path d="M130 180 Q136 182 142 186 Q150 192 154 200 Q158 208 160 216 L116 216 L116 200 Q118 192 122 186 Q124 182 130 180 Z" fill={intensityColors[areas.quadril_dir]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("quadril_dir")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
          <path d="M60 216 L104 216 L100 310 Q98 316 94 318 L70 318 Q66 316 64 310 Z" fill={intensityColors[areas.coxa_esq]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("coxa_esq")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
          <path d="M116 216 L160 216 L156 310 Q154 316 150 318 L126 318 Q122 316 120 310 Z" fill={intensityColors[areas.coxa_dir]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("coxa_dir")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
          <path d="M70 318 L94 318 Q96 340 96 355 Q96 370 94 380 Q92 388 90 390 L70 390 Q68 388 66 380 Q64 370 64 355 Q64 340 66 318 Z" fill={intensityColors[areas.panturrilha_esq]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("panturrilha_esq")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
          <path d="M126 318 L150 318 Q152 340 156 355 Q156 370 154 380 Q152 388 150 390 L130 390 Q128 388 126 380 Q124 370 124 355 Q124 340 126 318 Z" fill={intensityColors[areas.panturrilha_dir]} stroke="rgba(140,160,180,0.4)" strokeWidth="1" onClick={() => toggleArea("panturrilha_dir")} className={readOnly ? "transition-all duration-200" : "cursor-pointer transition-all duration-200"} />
        </svg>
      </motion.div>

      {!readOnly && (
        <>
          <div className="flex items-center gap-6 mt-6 mb-4">
            <span className="flex items-center gap-1.5 text-xs text-foreground/70"><span className="w-3 h-3 rounded-full" style={{ background: "rgba(244,165,53,0.5)" }} />Leve</span>
            <span className="flex items-center gap-1.5 text-xs text-foreground/70"><span className="w-3 h-3 rounded-full" style={{ background: "rgba(244,165,53,0.85)" }} />Moderado</span>
            <span className="flex items-center gap-1.5 text-xs text-foreground/70"><span className="w-3 h-3 rounded-full" style={{ background: "rgba(198,40,40,0.85)" }} />Intenso</span>
          </div>

          <p className="text-foreground/50 text-center italic mb-8 max-w-xs" style={{ fontWeight: 300, fontSize: "0.85rem" }}>
            Seja honesta consigo mesma. Este é o seu mapa para a leveza.
          </p>

          <button
            onClick={handleSubmit}
            disabled={!hasSelection}
            className={`w-full max-w-xs py-4 rounded-3xl text-sm font-medium transition-all ${hasSelection ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
          >
            Este é o meu mapa de fogo →
          </button>
        </>
      )}
    </div>
  );
};

export default HeatMapInteractive;
