// ─── New interface ───
interface FlowSilhouetteProps {
  painAreas?: Record<string, 0 | 1 | 2 | 3>;
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

const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 18,  cy: 80,  rx: 10, ry: 32, label: "Braço esq." },
  { id: "braco_dir",        cx: 82,  cy: 80,  rx: 10, ry: 32, label: "Braço dir." },
  { id: "abdomen",          cx: 50,  cy: 55,  rx: 17, ry: 24, label: "Torso" },
  { id: "quadril_esq",      cx: 37,  cy: 100, rx: 13, ry: 11, label: "Quadril esq." },
  { id: "quadril_dir",      cx: 63,  cy: 100, rx: 13, ry: 11, label: "Quadril dir." },
  { id: "coxa_esq",         cx: 36,  cy: 124, rx: 12, ry: 17, label: "Coxa esq." },
  { id: "coxa_dir",         cx: 64,  cy: 124, rx: 12, ry: 17, label: "Coxa dir." },
  { id: "panturrilha_esq",  cx: 35,  cy: 150, rx: 10, ry: 13, label: "Panturrilha esq." },
  { id: "panturrilha_dir",  cx: 65,  cy: 150, rx: 10, ry: 13, label: "Panturrilha dir." },
];

// ─── Core renderer ───
const FlowSilhouetteCore = ({
  painAreas = {},
  onAreaClick,
  showHydrationWave = false,
  className = "",
}: FlowSilhouetteProps) => {
  const interactive = !!onAreaClick;

  return (
    <div className={`relative mx-auto w-full max-w-[260px] ${className}`}>
      {/* Visual base layer */}
      <img
        src={showHydrationWave
          ? "/assets/flow_silhouette_full.png"
          : "/assets/flow_silhouette_base.png"}
        alt="Silhueta corporal"
        className="w-full h-auto pointer-events-none select-none"
      />

      {/* Interactive SVG overlay */}
      <svg
        viewBox="0 0 100 180"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="heat-leve" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="heat-moderado" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDBA74" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#FDBA74" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="heat-intenso" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FCA5A5" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity={0} />
          </radialGradient>
        </defs>

        {AREA_ELLIPSES.map(({ id, cx, cy, rx, ry }) => {
          const intensity = painAreas[id] ?? 0;
          const gradientId =
            intensity === 1 ? "heat-leve"
            : intensity === 2 ? "heat-moderado"
            : intensity === 3 ? "heat-intenso"
            : null;
          return (
            <ellipse
              key={id}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={gradientId ? `url(#${gradientId})` : "transparent"}
              className={interactive ? "cursor-pointer" : ""}
              onClick={interactive ? () => onAreaClick!(id) : undefined}
              style={{ transition: "fill 0.3s ease" }}
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

    const painAreas: Record<string, 0 | 1 | 2 | 3> = {};
    for (const [k, v] of Object.entries(safeHeatMap)) {
      painAreas[k] = Math.min(3, Math.max(0, typeof v === "number" ? v : 0)) as 0 | 1 | 2 | 3;
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
