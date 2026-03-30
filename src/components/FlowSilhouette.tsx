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

// ─── Feminine body silhouette path (viewBox 0 0 200 500) ───
const BODY_PATH = [
  // Head
  "M100,8 C88,8 78,18 78,32 C78,46 88,56 100,56 C112,56 122,46 122,32 C122,18 112,8 100,8 Z",
  // Neck
  "M92,56 L92,68 L108,68 L108,56",
  // Shoulders + Arms + Torso
  "M92,68 L72,74 L52,78 L38,100 L32,140 L28,180 L32,184 L38,180 L42,160 L48,130 L56,108 L68,88 L76,82 L80,90 L78,120 L76,160 L78,200",
  // Waist left → hip
  "L74,230 L72,260 L70,280",
  // Left leg
  "L68,310 L66,340 L64,370 L62,400 L60,430 L58,455 L56,470 L58,478 L64,480 L70,478 L72,470 L70,440 L72,410 L74,380 L78,350 L82,320 L86,290",
  // Crotch
  "L90,280 L100,275 L110,280",
  // Right leg
  "L114,290 L118,320 L122,350 L126,380 L128,410 L130,440 L128,470 L130,478 L136,480 L142,478 L144,470 L142,455 L140,430 L138,400 L136,370 L134,340 L132,310 L130,280",
  // Right hip → waist
  "L128,260 L126,230 L122,200",
  // Right arm + shoulder (mirror)
  "L124,160 L122,120 L120,90 L124,82 L132,88 L144,108 L152,130 L158,160 L162,180 L168,184 L172,180 L168,140 L162,100 L148,78 L128,74 L108,68",
].join(" ");

// ─── Heat zone paths (organic, inside body contour) ───
const ZONE_PATHS: { id: string; path: string; cx: number; cy: number }[] = [
  {
    id: "braco_esq",
    path: "M38,100 L48,130 L42,160 L38,180 L32,184 L28,180 L32,140 Z",
    cx: 38, cy: 140,
  },
  {
    id: "braco_dir",
    path: "M162,100 L152,130 L158,160 L162,180 L168,184 L172,180 L168,140 Z",
    cx: 162, cy: 140,
  },
  {
    id: "abdomen",
    path: "M80,90 L78,120 L76,160 L78,200 L122,200 L124,160 L122,120 L120,90 Z",
    cx: 100, cy: 145,
  },
  {
    id: "quadril_esq",
    path: "M78,200 L74,230 L72,260 L86,260 L90,240 L86,220 L82,200 Z",
    cx: 80, cy: 230,
  },
  {
    id: "quadril_dir",
    path: "M122,200 L126,230 L128,260 L114,260 L110,240 L114,220 L118,200 Z",
    cx: 120, cy: 230,
  },
  {
    id: "coxa_esq",
    path: "M70,280 L68,310 L66,340 L78,350 L82,320 L86,290 L80,275 Z",
    cx: 76, cy: 315,
  },
  {
    id: "coxa_dir",
    path: "M130,280 L132,310 L134,340 L122,350 L118,320 L114,290 L120,275 Z",
    cx: 124, cy: 315,
  },
  {
    id: "panturrilha_esq",
    path: "M64,370 L62,400 L60,430 L70,440 L72,410 L74,380 L70,365 Z",
    cx: 67, cy: 400,
  },
  {
    id: "panturrilha_dir",
    path: "M136,370 L138,400 L140,430 L130,440 L128,410 L126,380 L130,365 Z",
    cx: 133, cy: 400,
  },
];

const HEAT_COLORS: Record<number, [string, string]> = {
  1: ["#FDE68A", "#F59E0B"],   // yellow glow
  2: ["#FDBA74", "#EA580C"],   // orange glow
  3: ["#FCA5A5", "#DC2626"],   // red glow
};

// ─── Core SVG renderer ───
const FlowSilhouetteCore: React.FC<FlowSilhouetteProps> = ({
  painAreas = {},
  onAreaClick,
  showHydrationWave = false,
  className = "",
}) => {
  const interactive = typeof onAreaClick === "function";

  return (
    <div
      className={`relative w-full max-w-[280px] mx-auto ${className}`}
      style={{ backdropFilter: "blur(10px)" }}
    >
      <svg
        viewBox="0 0 200 500"
        className="w-full h-auto select-none"
        style={{ filter: "drop-shadow(0 0 20px rgba(46,134,171,0.15))" }}
      >
        <defs>
          {/* Clip to body outline */}
          <clipPath id="bodyClip">
            <path d={BODY_PATH} fillRule="evenodd" />
          </clipPath>

          {/* Glow blur for heat zones */}
          <filter id="heatGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          {/* Radial gradients for each intensity level */}
          {[1, 2, 3].map((level) => (
            <radialGradient key={level} id={`heat${level}`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor={HEAT_COLORS[level][0]} stopOpacity="0.8" />
              <stop offset="100%" stopColor={HEAT_COLORS[level][1]} stopOpacity="0.1" />
            </radialGradient>
          ))}

          {/* Hydration wave gradient */}
          {showHydrationWave && (
            <linearGradient id="hydrationWave" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
              <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          )}
        </defs>

        {/* Glass body outline */}
        <path
          d={BODY_PATH}
          fill="white"
          fillOpacity={0.08}
          stroke="white"
          strokeOpacity={0.3}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Hydration wave (inside body) */}
        {showHydrationWave && (
          <motion.rect
            x="0" y="0" width="200" height="500"
            fill="url(#hydrationWave)"
            clipPath="url(#bodyClip)"
            animate={{ y: [20, 0, 20] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Heat zones — glow layer (blurred, clipped inside body) */}
        <g clipPath="url(#bodyClip)">
          {ZONE_PATHS.map(({ id, path }) => {
            const intensity = painAreas[id] || 0;
            if (intensity <= 0) return null;
            return (
              <motion.path
                key={`glow-${id}`}
                d={path}
                fill={`url(#heat${intensity})`}
                filter="url(#heatGlow)"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            );
          })}
        </g>

        {/* Zone affordance outlines + click targets */}
        {ZONE_PATHS.map(({ id, path }) => {
          const intensity = painAreas[id] || 0;
          return (
            <path
              key={`zone-${id}`}
              d={path}
              fill={intensity > 0 ? `url(#heat${intensity})` : "transparent"}
              fillOpacity={intensity > 0 ? 0.35 : 0}
              stroke="rgba(200,200,200,0.25)"
              strokeWidth="0.8"
              strokeDasharray={intensity > 0 ? "0" : "3,2"}
              className={interactive ? "cursor-pointer" : ""}
              onClick={() => onAreaClick?.(id)}
              style={{ transition: "fill-opacity 0.3s ease" }}
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
