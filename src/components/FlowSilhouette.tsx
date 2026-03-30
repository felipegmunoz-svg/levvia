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

// ─── SVG ellipse zones (viewBox 0 0 200 500) ───
const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 68,  cy: 185, rx: 18, ry: 60, rotate: -5 },
  { id: "braco_dir",        cx: 132, cy: 185, rx: 18, ry: 60, rotate:  5 },
  { id: "abdomen",          cx: 100, cy: 190, rx: 27, ry: 68, rotate:  0 },
  { id: "quadril_esq",      cx: 82,  cy: 265, rx: 16, ry: 20, rotate:  0 },
  { id: "quadril_dir",      cx: 118, cy: 265, rx: 16, ry: 20, rotate:  0 },
  { id: "coxa_esq",         cx: 82,  cy: 330, rx: 14, ry: 46, rotate:  0 },
  { id: "coxa_dir",         cx: 118, cy: 330, rx: 14, ry: 46, rotate:  0 },
  { id: "panturrilha_esq",  cx: 81,  cy: 430, rx: 11, ry: 36, rotate:  0 },
  { id: "panturrilha_dir",  cx: 119, cy: 430, rx: 11, ry: 36, rotate:  0 },
];

const GLOW_BACKGROUNDS: Record<number, string> = {
  1: "rgba(251, 191, 36, 0.9)",
  2: "rgba(249, 115, 22, 0.9)",
  3: "rgba(239, 68, 68, 0.9)",
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
      className={`relative mx-auto ${className ?? ""}`}
      style={{ width: "100%", maxWidth: "200px" }}
    >
      {/* Base image */}
      <img
        src={imgSrc}
        alt="Silhueta corporal"
        className="pointer-events-none select-none"
        style={{ width: "100%", height: "auto", display: "block" }}
        draggable={false}
      />

      {/* SVG overlay */}
      <svg
        viewBox="0 0 200 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {AREA_ELLIPSES.map(({ id, cx, cy, rx, ry, rotate }) => {
          const intensity = (painAreas?.[id] ?? 0) as 0 | 1 | 2 | 3;
          return (
            <ellipse
              key={id}
              cx={cx} cy={cy} rx={rx} ry={ry}
              transform={`rotate(${rotate}, ${cx}, ${cy})`}
              fill="rgba(96,165,250,0.15)"
              stroke="#60A5FA"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              className={onAreaClick ? "cursor-pointer" : ""}
              onClick={() => onAreaClick?.(id)}
            />
          );
        })}
      </svg>
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
