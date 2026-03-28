import { motion } from "framer-motion";

// ─── New interface ───
interface FlowSilhouetteProps {
  painAreas: Record<string, 0 | 1 | 2 | 3>;
  onAreaClick?: (area: string) => void;
  hydrationLevel?: number; // 0–100
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

const PAIN_COLORS: Record<number, string> = {
  0: "transparent",
  1: "rgba(251, 191, 36, 0.4)",
  2: "rgba(245, 158, 11, 0.6)",
  3: "rgba(239, 68, 68, 0.8)",
};

const DECO_FILL = "rgba(255,255,255,0.85)";
const DECO_STROKE = "rgba(255,255,255,0.4)";

// ─── Core silhouette renderer ───
const FlowSilhouetteCore = ({
  painAreas,
  onAreaClick,
  hydrationLevel = 0,
  showHydrationWave = false,
  className = "",
}: FlowSilhouetteProps) => {
  const getColor = (area: string) => PAIN_COLORS[painAreas[area] ?? 0];
  const intensity = (area: string) => painAreas[area] ?? 0;
  const interactive = !!onAreaClick;

  const areaProps = (area: string) => ({
    fill: getColor(area),
    className: `transition-colors duration-300 ${interactive ? "cursor-pointer" : ""}`,
    onClick: interactive ? () => onAreaClick!(area) : undefined,
    style: intensity(area) > 0 ? { filter: "blur(6px)" } : undefined,
  });

  // Wave Y: hydrationLevel 0 → bottom (480), 100 → top (60)
  const waveY = 480 - (hydrationLevel / 100) * 420;
  const waveA = `M30 ${waveY} Q100 ${waveY - 15} 170 ${waveY} Q240 ${waveY + 15} 280 ${waveY}`;
  const waveB = `M30 ${waveY} Q100 ${waveY + 15} 170 ${waveY} Q240 ${waveY - 15} 280 ${waveY}`;

  return (
    <div className={`relative w-full max-w-[280px] mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl ${className}`}>
      <div className="flex justify-center items-center w-full">
        <svg
          viewBox="0 0 280 520"
          className="w-full max-w-[260px] h-auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: "drop-shadow(0 4px 32px rgba(59, 130, 246, 0.12))" }}
        >
          <defs>
            <filter id="fs-heat-glow">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="fs-wave-blur">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* ── Decorative: head, neck, hands, feet ── */}
          <ellipse cx="140" cy="48" rx="25" ry="32" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <rect x="130" y="74" width="20" height="22" rx="5" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <ellipse cx="48" cy="285" rx="10" ry="13" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <ellipse cx="232" cy="285" rx="10" ry="13" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <path d="M86 493 Q84 503 82 509 Q80 516 84 518 L114 518 Q118 516 118 509 Q118 503 116 493 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <path d="M164 493 Q162 503 162 509 Q162 516 166 518 L196 518 Q200 516 198 509 Q198 503 194 493 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />

          {/* ── Base body silhouette (white) ── */}
          {/* Arms */}
          <path d="M86 98 Q72 106 62 126 Q54 148 48 178 Q42 210 42 240 Q41 260 44 272 L64 272 Q66 260 66 240 Q66 210 72 178 Q78 148 84 126 Q88 114 98 104 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <path d="M194 98 Q208 106 218 126 Q226 148 232 178 Q238 210 238 240 Q239 260 236 272 L216 272 Q214 260 214 240 Q214 210 208 178 Q202 148 196 126 Q192 114 182 104 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          {/* Torso */}
          <path d="M98 96 Q114 94 140 94 Q166 94 182 96 Q192 100 196 114 Q200 128 200 140 Q198 164 192 182 Q188 200 180 216 Q172 226 166 228 L114 228 Q108 226 100 216 Q92 200 86 182 Q80 164 78 140 Q78 128 82 114 Q88 100 98 96 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          {/* Hips */}
          <path d="M114 228 Q108 230 100 236 Q90 244 84 254 Q78 264 76 274 L132 274 L132 254 Q130 244 124 236 Q122 230 114 228 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <path d="M166 228 Q172 230 180 236 Q190 244 196 254 Q202 264 204 274 L148 274 L148 254 Q150 244 156 236 Q158 230 166 228 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          {/* Thighs */}
          <path d="M76 274 L132 274 L128 392 Q126 400 120 402 L88 402 Q82 400 80 392 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <path d="M148 274 L204 274 L200 392 Q198 400 192 402 L160 402 Q154 400 152 392 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          {/* Calves */}
          <path d="M88 402 L120 402 Q122 428 122 448 Q122 468 120 480 Q118 490 116 493 L88 493 Q86 490 84 480 Q82 468 82 448 Q82 428 84 402 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />
          <path d="M160 402 L192 402 Q194 428 198 448 Q198 468 196 480 Q194 490 192 493 L164 493 Q162 490 160 480 Q158 468 158 448 Q158 428 160 402 Z" fill={DECO_FILL} stroke={DECO_STROKE} strokeWidth={1} />

          {/* ── Heat overlay ── */}
          <g>
            <path d="M86 98 Q72 106 62 126 Q54 148 48 178 Q42 210 42 240 Q41 260 44 272 L64 272 Q66 260 66 240 Q66 210 72 178 Q78 148 84 126 Q88 114 98 104 Z" {...areaProps("braco_esq")} />
            <path d="M194 98 Q208 106 218 126 Q226 148 232 178 Q238 210 238 240 Q239 260 236 272 L216 272 Q214 260 214 240 Q214 210 208 178 Q202 148 196 126 Q192 114 182 104 Z" {...areaProps("braco_dir")} />
            <path d="M98 96 Q114 94 140 94 Q166 94 182 96 Q192 100 196 114 Q200 128 200 140 Q198 164 192 182 Q188 200 180 216 Q172 226 166 228 L114 228 Q108 226 100 216 Q92 200 86 182 Q80 164 78 140 Q78 128 82 114 Q88 100 98 96 Z" {...areaProps("abdomen")} />
            <path d="M114 228 Q108 230 100 236 Q90 244 84 254 Q78 264 76 274 L132 274 L132 254 Q130 244 124 236 Q122 230 114 228 Z" {...areaProps("quadril_esq")} />
            <path d="M166 228 Q172 230 180 236 Q190 244 196 254 Q202 264 204 274 L148 274 L148 254 Q150 244 156 236 Q158 230 166 228 Z" {...areaProps("quadril_dir")} />
            <path d="M76 274 L132 274 L128 392 Q126 400 120 402 L88 402 Q82 400 80 392 Z" {...areaProps("coxa_esq")} />
            <path d="M148 274 L204 274 L200 392 Q198 400 192 402 L160 402 Q154 400 152 392 Z" {...areaProps("coxa_dir")} />
            <path d="M88 402 L120 402 Q122 428 122 448 Q122 468 120 480 Q118 490 116 493 L88 493 Q86 490 84 480 Q82 468 82 448 Q82 428 84 402 Z" {...areaProps("panturrilha_esq")} />
            <path d="M160 402 L192 402 Q194 428 198 448 Q198 468 196 480 Q194 490 192 493 L164 493 Q162 490 160 480 Q158 468 158 448 Q158 428 160 402 Z" {...areaProps("panturrilha_dir")} />
          </g>

          {/* ── Hydration wave (animated) ── */}
          {showHydrationWave && (
            <motion.path
              d={waveA}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={16}
              strokeLinecap="round"
              opacity={0.5}
              style={{ filter: "drop-shadow(0 0 8px #3B82F6)" }}
              animate={{ d: [waveA, waveB, waveA] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </svg>
      </div>
    </div>
  );
};

// ─── Legacy-compatible default export ───
// Detects old props shape (heatMapData) vs new (painAreas)
const FlowSilhouette = (props: FlowSilhouetteProps | LegacyFlowSilhouetteProps) => {
  if ("heatMapData" in props) {
    // Legacy mode for Progress.tsx
    const { heatMapData, waterIntakeMl, waterGoalMl, size = "large", animated = true } = props as LegacyFlowSilhouetteProps;
    const safeHeatMap = heatMapData || {};
    const hydrationPercent = waterGoalMl > 0 ? Math.min(waterIntakeMl / waterGoalMl, 1) : 0;
    const score = calculateFlowScore(safeHeatMap);
    const scoreColor = score <= 40 ? "text-destructive" : score <= 70 ? "text-warning" : "text-primary";
    const isLarge = size === "large";

    const painAreas: Record<string, 0 | 1 | 2 | 3> = {};
    for (const [k, v] of Object.entries(safeHeatMap)) {
      painAreas[k] = Math.min(3, Math.max(0, typeof v === "number" ? v : 0)) as 0 | 1 | 2 | 3;
    }

    const content = (
      <div className="flex flex-col items-center">
        <FlowSilhouetteCore
          painAreas={painAreas}
          hydrationLevel={Math.round(hydrationPercent * 100)}
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

  // New mode
  return <FlowSilhouetteCore {...(props as FlowSilhouetteProps)} />;
};

export default FlowSilhouette;
