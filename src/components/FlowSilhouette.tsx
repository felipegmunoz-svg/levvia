import React from "react";
import { motion } from "framer-motion";

// ─── New interface ───
interface FlowSilhouetteProps {
  painAreas?: Record<string, number>;
  onAreaClick?: (area: string) => void;
  showHydrationWave?: boolean;
  className?: string;
}

// ─── Legacy interface (used by Progress.tsx) ───
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

const AREA_CONFIG = [
  { id: "braco_esq",        cx: 28,  cy: 35, rx: 6,  ry: 12, rotate: 15  },
  { id: "braco_dir",        cx: 72,  cy: 35, rx: 6,  ry: 12, rotate: -15 },
  { id: "abdomen",          cx: 50,  cy: 38, rx: 12, ry: 15, rotate: 0   },
  { id: "quadril_esq",      cx: 42,  cy: 52, rx: 8,  ry: 8,  rotate: 0   },
  { id: "quadril_dir",      cx: 58,  cy: 52, rx: 8,  ry: 8,  rotate: 0   },
  { id: "coxa_esq",         cx: 42,  cy: 68, rx: 7,  ry: 12, rotate: 5   },
  { id: "coxa_dir",         cx: 58,  cy: 68, rx: 7,  ry: 12, rotate: -5  },
  { id: "panturrilha_esq",  cx: 43,  cy: 85, rx: 6,  ry: 10, rotate: 2   },
  { id: "panturrilha_dir",  cx: 57,  cy: 85, rx: 6,  ry: 10, rotate: -2  },
];

const PAIN_COLORS: Record<number, string> = {
  0: "transparent",
  1: "#FDE68A",
  2: "#FDBA74",
  3: "#FCA5A5",
};

// ─── Core renderer ───
const FlowSilhouetteCore: React.FC<FlowSilhouetteProps> = ({
  painAreas = {},
  onAreaClick,
  showHydrationWave = false,
  className = "",
}) => {
  const imageSrc = showHydrationWave
    ? "/assets/flow_silhouette_full.png"
    : "/assets/flow_silhouette_base.png";

  return (
    <div className={`relative w-full max-w-[400px] mx-auto aspect-[3/4] ${className}`}>
      <img
        src={imageSrc}
        alt="Silhueta corporal"
        className="absolute inset-0 w-full h-full object-contain z-0"
      />
      <svg
        viewBox="0 0 100 133.3"
        className="absolute inset-0 w-full h-full z-10 select-none"
      >
        <defs>
          <filter id="heatBlur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        {AREA_CONFIG.map((area) => {
          const intensity = painAreas[area.id] || 0;
          return (
            <g
              key={area.id}
              onClick={() => onAreaClick?.(area.id)}
              className={onAreaClick ? "cursor-pointer" : ""}
              transform={`rotate(${area.rotate}, ${area.cx}, ${area.cy})`}
            >
              {intensity > 0 && (
                <motion.ellipse
                  cx={area.cx} cy={area.cy} rx={area.rx} ry={area.ry}
                  fill={PAIN_COLORS[intensity] || "transparent"}
                  fillOpacity={0.6}
                  filter="url(#heatBlur)"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <ellipse
                cx={area.cx} cy={area.cy} rx={area.rx} ry={area.ry}
                fill="transparent"
                stroke="rgba(200,200,200,0.3)"
                strokeWidth="0.5"
                strokeDasharray="2 1"
              />
            </g>
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
