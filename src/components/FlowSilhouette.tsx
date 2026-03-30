import { motion } from "framer-motion";

interface FlowSilhouetteProps {
  heatMapData: Record<string, number> | null | undefined;
  waterIntakeMl: number;
  waterGoalMl: number;
  size?: "small" | "large";
  animated?: boolean;
  onZoneClick?: (zone: string, level: number) => void;
  interactive?: boolean;
}

export function calculateFlowScore(
  heatMapData: Record<string, number> | null | undefined
): number {
  if (!heatMapData || typeof heatMapData !== "object") return 100;
  const values = Object.values(heatMapData);
  if (values.length === 0) return 100;
  const total = values.reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
  return Math.round((1 - total / 27) * 100);
}

const HEAT_COLORS: Record<number, string> = {
  0: "rgba(0,0,0,0)",
  1: "rgba(244,165,53,0.35)",
  2: "rgba(244,120,30,0.55)",
  3: "rgba(198,40,40,0.70)",
};

const ZONES = [
  { id: "braco_esq",       cx: 35,  cy: 180, rx: 14, ry: 60 },
  { id: "braco_dir",       cx: 165, cy: 180, rx: 14, ry: 60 },
  { id: "abdomen",         cx: 100, cy: 155, rx: 26, ry: 60 },
  { id: "quadril_esq",     cx: 72,  cy: 265, rx: 20, ry: 18 },
  { id: "quadril_dir",     cx: 128, cy: 265, rx: 20, ry: 18 },
  { id: "coxa_esq",        cx: 73,  cy: 340, rx: 18, ry: 52 },
  { id: "coxa_dir",        cx: 127, cy: 340, rx: 18, ry: 52 },
  { id: "panturrilha_esq", cx: 78,  cy: 440, rx: 12, ry: 36 },
  { id: "panturrilha_dir", cx: 122, cy: 440, rx: 12, ry: 36 },
];

const BODY_PATH =
  "M 100,6 L 85,11 L 77,23 L 77,41 L 85,60 L 85,74 " +
  "L 74,82 L 50,88 L 41,99 L 33,151 L 18,187 L 3,247 " +
  "L 8,265 L 17,272 L 21,270 L 18,260 L 21,257 L 22,227 " +
  "L 46,186 L 62,141 L 67,168 L 48,211 L 44,230 L 44,251 " +
  "L 65,337 L 65,391 L 82,447 L 82,465 L 73,483 L 73,489 " +
  "L 82,493 L 94,493 L 99,491 L 101,484 L 104,492 " +
  "L 117,493 L 130,487 L 121,464 L 121,446 " +
  "L 138,386 L 138,332 L 158,251 L 154,213 L 134,166 " +
  "L 139,140 L 156,189 L 177,227 L 178,257 L 181,261 " +
  "L 178,269 L 182,272 L 187,270 L 197,251 " +
  "L 182,185 L 168,152 L 159,98 L 150,87 " +
  "L 127,82 L 117,75 L 115,61 L 123,43 L 122,22 L 116,11 Z";

const FlowSilhouette = ({
  heatMapData,
  waterIntakeMl,
  waterGoalMl,
  size = "large",
  animated = true,
  onZoneClick,
  interactive = false,
}: FlowSilhouetteProps) => {
  const safeHeatMap = heatMapData || {};
  const hydrationPercent =
    waterGoalMl > 0 ? Math.min(waterIntakeMl / waterGoalMl, 1) : 0;
  const score = calculateFlowScore(safeHeatMap);
  const scoreColor =
    score <= 40 ? "text-red-500" : score <= 70 ? "text-yellow-500" : "text-primary";

  const isLarge = size === "large";
  const svgW = isLarge ? "w-[200px]" : "w-[120px]";
  const svgH = isLarge ? "h-[500px]" : "h-[300px]";

  const waveTop = 494 - hydrationPercent * 488;

  const handleZoneClick = (id: string) => {
    if (!interactive || !onZoneClick) return;
    const current = safeHeatMap[id] ?? 0;
    onZoneClick(id, (current + 1) % 4);
  };

  const content = (
    <div className="flex flex-col items-center">
      <motion.div
        initial={animated ? { opacity: 0, scale: 0.95 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${svgW} ${svgH} relative`}
      >
        <svg viewBox="0 0 200 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="body-clip">
              <path d={BODY_PATH} />
            </clipPath>
            <linearGradient id="hydration-grad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(46,196,182,0.45)" />
              <stop offset="80%" stopColor="rgba(46,196,182,0.20)" />
              <stop offset="100%" stopColor="rgba(46,196,182,0)" />
            </linearGradient>
          </defs>

          {/* Corpo — glassmorphism */}
          <path
            d={BODY_PATH}
            fill="rgba(240,246,252,0.18)"
            stroke="rgba(160,200,230,0.45)"
            strokeWidth="1.2"
          />

          {/* Zonas de calor */}
          {ZONES.map(({ id, cx, cy, rx, ry }) => (
            <ellipse
              key={id}
              cx={cx} cy={cy} rx={rx} ry={ry}
              fill={HEAT_COLORS[safeHeatMap[id] ?? 0]}
              stroke={interactive ? "rgba(180,200,220,0.5)" : "transparent"}
              strokeWidth="0.8"
              style={{ cursor: interactive ? "pointer" : "default" }}
              onClick={() => handleZoneClick(id)}
            />
          ))}

          {/* Onda de hidratação */}
          <g clipPath="url(#body-clip)">
            <rect
              x="0" y={waveTop} width="200" height={500 - waveTop}
              fill="url(#hydration-grad)"
            />
          </g>
        </svg>
      </motion.div>

      <p className={`text-sm font-heading font-semibold mt-3 ${scoreColor}`}>
        Score de Fluxo: {score}%
      </p>

      <div className="w-full max-w-[200px] mt-2 flex items-center gap-2">
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

  return isLarge ? <div className="levvia-card p-6">{content}</div> : content;
};

export default FlowSilhouette;
