import { motion } from "framer-motion";

interface FlowSilhouetteProps {
  heatMapData: Record<string, number> | null | undefined;
  waterIntakeMl: number;
  waterGoalMl: number;
  size?: "small" | "large";
  animated?: boolean;
}

const intensityColors: Record<number, string> = {
  0: "rgba(0,0,0,0)",
  1: "rgba(244,165,53,0.3)",
  2: "rgba(244,165,53,0.6)",
  3: "rgba(198,40,40,0.7)",
};

export function calculateFlowScore(heatMapData: Record<string, number> | null | undefined): number {
  if (!heatMapData || typeof heatMapData !== 'object') return 100;
  const values = Object.values(heatMapData);
  if (values.length === 0) return 100;
  const total = values.reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
  return Math.round((1 - total / 27) * 100);
}

const FlowSilhouette = ({
  heatMapData,
  waterIntakeMl,
  waterGoalMl,
  size = "large",
  animated = true,
}: FlowSilhouetteProps) => {
  const safeHeatMap = heatMapData || {};
  const hydrationPercent = waterGoalMl > 0 ? Math.min(waterIntakeMl / waterGoalMl, 1) : 0;
  const score = calculateFlowScore(safeHeatMap);
  const scoreColor = score <= 40 ? "text-red-500" : score <= 70 ? "text-yellow-500" : "text-primary";

  const isLarge = size === "large";
  const svgW = isLarge ? "w-[280px]" : "w-[140px]";
  const svgH = isLarge ? "h-[420px]" : "h-[210px]";

  const getColor = (area: string) => intensityColors[safeHeatMap[area] ?? 0];

  const auraTop = 440 * (1 - hydrationPercent);

  const content = (
    <div className="flex flex-col items-center">
      <motion.div
        initial={animated ? { opacity: 0, scale: 0.95 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${svgW} ${svgH} relative`}
      >
        <svg viewBox="0 0 220 440" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flow-aura-grad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(46,196,182,0.4)" />
              <stop offset="85%" stopColor="rgba(46,196,182,0.2)" />
              <stop offset="100%" stopColor="rgba(46,196,182,0)" />
            </linearGradient>
            <clipPath id="silhouette-clip">
              <ellipse cx="110" cy="38" rx="20" ry="25" />
              <rect x="102" y="58" width="16" height="18" rx="4" />
              <path d="M68 78 Q56 84 48 100 Q42 116 38 140 Q34 165 34 190 Q33 205 36 215 L52 215 Q54 205 54 190 Q54 165 58 140 Q62 116 66 100 Q70 90 78 82 Z" />
              <path d="M152 78 Q164 84 172 100 Q178 116 182 140 Q186 165 186 190 Q187 205 184 215 L168 215 Q166 205 166 190 Q166 165 162 140 Q158 116 154 100 Q150 90 142 82 Z" />
              <path d="M78 76 Q90 74 110 74 Q130 74 142 76 Q150 80 154 90 Q158 100 158 110 Q156 130 152 145 Q148 158 142 170 Q136 178 130 180 L90 180 Q84 178 78 170 Q72 158 68 145 Q64 130 62 110 Q62 100 66 90 Q70 80 78 76 Z" />
              <path d="M90 180 Q84 182 78 186 Q70 192 66 200 Q62 208 60 216 L104 216 L104 200 Q102 192 98 186 Q96 182 90 180 Z" />
              <path d="M130 180 Q136 182 142 186 Q150 192 154 200 Q158 208 160 216 L116 216 L116 200 Q118 192 122 186 Q124 182 130 180 Z" />
              <path d="M60 216 L104 216 L100 310 Q98 316 94 318 L70 318 Q66 316 64 310 Z" />
              <path d="M116 216 L160 216 L156 310 Q154 316 150 318 L126 318 Q122 316 120 310 Z" />
              <path d="M70 318 L94 318 Q96 340 96 355 Q96 370 94 380 Q92 388 90 390 L70 390 Q68 388 66 380 Q64 370 64 355 Q64 340 66 318 Z" />
              <path d="M126 318 L150 318 Q152 340 156 355 Q156 370 154 380 Q152 388 150 390 L130 390 Q128 388 126 380 Q124 370 124 355 Q124 340 126 318 Z" />
              <path d="M68 390 Q66 400 64 406 Q62 412 66 414 L90 414 Q94 412 94 406 Q94 400 92 390 Z" />
              <path d="M128 390 Q126 400 126 406 Q126 412 130 414 L154 414 Q158 412 156 406 Q156 400 152 390 Z" />
              <ellipse cx="40" cy="225" rx="8" ry="10" />
              <ellipse cx="180" cy="225" rx="8" ry="10" />
            </clipPath>
          </defs>

          <g opacity="0.9">
            <ellipse cx="110" cy="38" rx="20" ry="25" fill="rgba(240,245,250,0.15)" stroke="rgba(180,200,220,0.3)" strokeWidth="1.2" />
            <rect x="102" y="58" width="16" height="18" rx="4" fill="rgba(240,245,250,0.15)" stroke="rgba(180,200,220,0.3)" strokeWidth="1.2" />
            <ellipse cx="40" cy="225" rx="8" ry="10" fill="rgba(240,245,250,0.15)" stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
            <ellipse cx="180" cy="225" rx="8" ry="10" fill="rgba(240,245,250,0.15)" stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
            <path d="M68 390 Q66 400 64 406 Q62 412 66 414 L90 414 Q94 412 94 406 Q94 400 92 390 Z" fill="rgba(240,245,250,0.15)" stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
            <path d="M128 390 Q126 400 126 406 Q126 412 130 414 L154 414 Q158 412 156 406 Q156 400 152 390 Z" fill="rgba(240,245,250,0.15)" stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          </g>

          <path d="M68 78 Q56 84 48 100 Q42 116 38 140 Q34 165 34 190 Q33 205 36 215 L52 215 Q54 205 54 190 Q54 165 58 140 Q62 116 66 100 Q70 90 78 82 Z" fill={getColor("braco_esq")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          <path d="M152 78 Q164 84 172 100 Q178 116 182 140 Q186 165 186 190 Q187 205 184 215 L168 215 Q166 205 166 190 Q166 165 162 140 Q158 116 154 100 Q150 90 142 82 Z" fill={getColor("braco_dir")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          <path d="M78 76 Q90 74 110 74 Q130 74 142 76 Q150 80 154 90 Q158 100 158 110 Q156 130 152 145 Q148 158 142 170 Q136 178 130 180 L90 180 Q84 178 78 170 Q72 158 68 145 Q64 130 62 110 Q62 100 66 90 Q70 80 78 76 Z" fill={getColor("abdomen")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          <path d="M90 180 Q84 182 78 186 Q70 192 66 200 Q62 208 60 216 L104 216 L104 200 Q102 192 98 186 Q96 182 90 180 Z" fill={getColor("quadril_esq")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          <path d="M130 180 Q136 182 142 186 Q150 192 154 200 Q158 208 160 216 L116 216 L116 200 Q118 192 122 186 Q124 182 130 180 Z" fill={getColor("quadril_dir")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          <path d="M60 216 L104 216 L100 310 Q98 316 94 318 L70 318 Q66 316 64 310 Z" fill={getColor("coxa_esq")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          <path d="M116 216 L160 216 L156 310 Q154 316 150 318 L126 318 Q122 316 120 310 Z" fill={getColor("coxa_dir")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          <path d="M70 318 L94 318 Q96 340 96 355 Q96 370 94 380 Q92 388 90 390 L70 390 Q68 388 66 380 Q64 370 64 355 Q64 340 66 318 Z" fill={getColor("panturrilha_esq")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />
          <path d="M126 318 L150 318 Q152 340 156 355 Q156 370 154 380 Q152 388 150 390 L130 390 Q128 388 126 380 Q124 370 124 355 Q124 340 126 318 Z" fill={getColor("panturrilha_dir")} stroke="rgba(180,200,220,0.3)" strokeWidth="1" />

          <g clipPath="url(#silhouette-clip)">
            <rect
              x="0"
              y={auraTop}
              width="220"
              height={440 - auraTop}
              fill="url(#flow-aura-grad)"
              className={animated ? "animate-flow-pulse" : ""}
            />
          </g>
        </svg>
      </motion.div>

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
        <span className="text-xs text-levvia-muted font-body whitespace-nowrap">
          {waterIntakeMl}ml / {waterGoalMl}ml
        </span>
      </div>
    </div>
  );

  if (isLarge) {
    return <div className="levvia-card p-6">{content}</div>;
  }

  return content;
};

export default FlowSilhouette;
