import { useState } from "react";
import { motion } from "framer-motion";
import FlowSilhouette from "@/components/FlowSilhouette";

interface HeatMapInteractiveProps {
  onNext?: (heatMap: Record<string, number | string>) => void;
  initialData?: Partial<Record<AreaId, number>> | null;
  readOnly?: boolean;
  size?: "small" | "normal";
  showHydrationAura?: boolean;
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
  0: "rgba(255,255,255,0.0)",
  1: "rgba(244,165,53,0.5)",
  2: "rgba(224,90,58,0.65)",
  3: "rgba(200,40,40,0.8)",
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

// Decorative styles
const decoFill = "rgba(255,255,255,0.85)";
const decoStroke = "rgba(255,255,255,0.6)";
const decoStrokeWidth = "1.2";

const HeatMapInteractive = ({
  onNext,
  initialData,
  readOnly = false,
  size = "normal",
  showHydrationAura = false,
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

  const areaClass = (id: AreaId) =>
    `transition-all duration-200 ${!readOnly ? "cursor-pointer" : ""}`;

  return (
    <div
      className={`w-full flex flex-col items-center px-6 py-6 rounded-2xl`}
      style={{ background: "#E8EEF4" }}
    >
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
      >
        <FlowSilhouette
          painAreas={areas as Record<string, 0 | 1 | 2 | 3>}
          onAreaClick={readOnly ? undefined : (area) => toggleArea(area as AreaId)}
          showHydrationWave={showHydrationAura}
        />
      </motion.div>

      {!readOnly && (
        <>
          <div className="flex items-center gap-6 mt-6 mb-4">
            <span className="flex items-center gap-1.5 text-xs text-foreground/70"><span className="w-3 h-3 rounded-full" style={{ background: "rgba(244,165,53,0.6)" }} />Leve</span>
            <span className="flex items-center gap-1.5 text-xs text-foreground/70"><span className="w-3 h-3 rounded-full" style={{ background: "rgba(224,90,58,0.75)" }} />Moderado</span>
            <span className="flex items-center gap-1.5 text-xs text-foreground/70"><span className="w-3 h-3 rounded-full" style={{ background: "rgba(200,40,40,0.85)" }} />Intenso</span>
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
