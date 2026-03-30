import React from "react";
import { motion } from "framer-motion";

// ─── Interfaces ───
interface FlowSilhouetteProps {
  painAreas?: Record<string, number>;
  onAreaClick?: (area: string) => void;
  showHydrationWave?: boolean;
  className?: string;
}

interface LegacyFlowSilhouetteProps {
  heatMapData: Record<string, number> | null | undefined;
  waterIntakeMl: number;
  waterGoalMl: number;
  size?: "small" | "large";
  animated?: boolean;
}

export function calculateFlowScore(heatMapData: Record<string, number> | null | undefined): number {
  if (!heatMapData || typeof heatMapData !== "object") return 100;
  const values = Object.values(heatMapData);
  if (values.length === 0) return 100;
  const total = values.reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
  return Math.round((1 - total / 27) * 100);
}

// ─── Zone configuration (percentage-based) ───
const ZONE_CONFIG = [
  { id: "braco_esq",       top: "30%", left: "28%", width: "8%",  height: "20%", rotate: "15deg" },
  { id: "braco_dir",       top: "30%", left: "64%", width: "8%",  height: "20%", rotate: "-15deg" },
  { id: "abdomen",         top: "35%", left: "40%", width: "20%", height: "15%", rotate: "0deg" },
  { id: "quadril_esq",     top: "50%", left: "35%", width: "10%", height: "8%",  rotate: "0deg" },
  { id: "quadril_dir",     top: "50%", left: "55%", width: "10%", height: "8%",  rotate: "0deg" },
  { id: "coxa_esq",        top: "58%", left: "33%", width: "10%", height: "20%", rotate: "5deg" },
  { id: "coxa_dir",        top: "58%", left: "57%", width: "10%", height: "20%", rotate: "-5deg" },
  { id: "panturrilha_esq", top: "80%", left: "35%", width: "8%",  height: "12%", rotate: "2deg" },
  { id: "panturrilha_dir", top: "80%", left: "57%", width: "8%",  height: "12%", rotate: "-2deg" },
];

const GLOW_BACKGROUNDS: Record<number, string> = {
  1: "rgba(251, 191, 36, 0.9)",
  2: "rgba(249, 115, 22, 0.9)",
  3: "rgba(239, 68, 68, 0.9)",
};

const GLOW_SHADOWS: Record<number, string> = {
  1: "0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2)",
  2: "0 0 20px rgba(234, 88, 12, 0.6), 0 0 40px rgba(234, 88, 12, 0.3)",
  3: "0 0 20px rgba(220, 38, 38, 0.7), 0 0 40px rgba(220, 38, 38, 0.3)",
};

// ─── Core renderer ───
const FlowSilhouetteCore: React.FC<FlowSilhouetteProps> = ({
  painAreas = {},
  onAreaClick,
  showHydrationWave = false,
  className = "",
}) => {
  const interactive = typeof onAreaClick === "function";
  const imgSrc = showHydrationWave
    ? "/assets/flow_silhouette_full.png"
    : "/assets/flow_silhouette_base.png";

  return (
    <div
      className={`relative mx-auto w-full max-w-[400px] max-h-[500px] ${className}`}
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* Base image */}
      <img
        src={imgSrc}
        alt="Silhueta corporal"
        className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
        draggable={false}
      />

      {/* Touch zone overlay */}
      <div className="absolute inset-0">
        {ZONE_CONFIG.map((zone) => {
          const intensity = painAreas[zone.id] || 0;
          const isActive = intensity > 0;

          return (
            <motion.div
              key={zone.id}
              onClick={() => onAreaClick?.(zone.id)}
              className={interactive ? "cursor-pointer" : ""}
              style={{
                position: "absolute",
                top: zone.top,
                left: zone.left,
                width: zone.width,
                height: zone.height,
                transform: `rotate(${zone.rotate})`,
                borderRadius: "40%",
                background: isActive ? GLOW_BACKGROUNDS[intensity] : "transparent",
                boxShadow: isActive ? GLOW_SHADOWS[intensity] : "none",
                filter: isActive ? "blur(20px)" : "none",
                border: !isActive && interactive
                  ? "1px dashed #60A5FA"
                  : "none",
                transition: "background 0.3s ease, box-shadow 0.3s ease",
              }}
              animate={isActive ? { opacity: [0.5, 0.9, 0.5] } : { opacity: 1 }}
              transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── Legacy-compatible default export ───
const FlowSilhouette = (props: FlowSilhouetteProps | LegacyFlowSilhouetteProps) => {
  if ("heatMapData" in props) {
    const { heatMapData, waterIntakeMl, waterGoalMl, size = "large", animated = true } = props as LegacyFlowSilhouetteProps;
    const safeHeatMap = heatMapData || {};
    const hydrationPercent = waterGoalMl > 0 ? Math.min(waterIntakeMl / waterGoalMl, 1) : 0;
    const score = calculateFlowScore(safeHeatMap);
    const scoreColor = score <= 40 ? "text-destructive" : score <= 70 ? "text-warning" : "text-primary";
    const isLarge = size === "large";

    const painAreas: Record<string, number> = {};
    for (const [k, v] of Object.entries(safeHeatMap)) {
      painAreas[k] = Math.min(3, Math.max(0, typeof v === "number" ? v : 0));
    }

    const content = (
      <div className="flex flex-col items-center">
        <FlowSilhouetteCore
          painAreas={painAreas}
          showHydrationWave={hydrationPercent > 0}
          className={isLarge ? "" : "max-w-[140px]"}
        />
        <p className={`text-sm font-heading font-semibold mt-4 ${scoreColor}`}>
          Score de Fluxo: {score}%
        </p>
        <div className="w-full max-w-[240px] mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${hydrationPercent * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-body whitespace-nowrap">
            {waterIntakeMl}ml / {waterGoalMl}ml
          </span>
        </div>
      </div>
    );

    if (isLarge) {
      return <div className="levvia-card p-6">{content}</div>;
    }
    return content;
  }

  return <FlowSilhouetteCore {...(props as FlowSilhouetteProps)} />;
};

export default FlowSilhouette;
