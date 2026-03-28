import { useState } from "react";
import { motion } from "framer-motion";
import HeatMapInteractive, { areaLabels } from "./HeatMapInteractive";

type AreaId = keyof typeof areaLabels;
const ALL_AREAS = Object.keys(areaLabels) as AreaId[];

interface HeatMapComparativeProps {
  day1Data: Record<string, number> | null;
  onNext: () => void;
  isReviewMode?: boolean;
}

const intensityLabel = (v: number) =>
  v === 1 ? "Leve" : v === 2 ? "Moderado" : v === 3 ? "Intenso" : null;

const intensityColor = (v: number) =>
  v === 1
    ? "bg-yellow-100 text-yellow-700"
    : v === 2
    ? "bg-orange-100 text-orange-700"
    : "bg-red-100 text-red-700";

const HeatMapComparative = ({
  day1Data,
  onNext,
  isReviewMode = false,
}: HeatMapComparativeProps) => {
  const [todayData, setTodayData] = useState<Record<string, number> | null>(null);
  const hasDay1 = day1Data && Object.values(day1Data).some((v) => v > 0);

  const handleTodayComplete = (data: Record<string, number | string>) => {
    const numeric: Record<string, number> = {};
    for (const [k, v] of Object.entries(data)) {
      numeric[k] = typeof v === "string" ? parseInt(v, 10) || 0 : v;
    }
    setTodayData(numeric);
  };

  // Compute improvement summary
  const summary = todayData
    ? (() => {
        let improved = 0;
        let same = 0;
        let worsened = 0;
        for (const area of ALL_AREAS) {
          const before = (day1Data?.[area] as number) || 0;
          const after = todayData[area] || 0;
          if (after < before) improved++;
          else if (after > before) worsened++;
          else same++;
        }
        return { improved, same, worsened };
      })()
    : null;

  // Intensity count helper
  const countIntensities = (data: Record<string, number> | null) => {
    if (!data) return { leve: 0, moderado: 0, intenso: 0 };
    let leve = 0, moderado = 0, intenso = 0;
    for (const v of Object.values(data)) {
      if (v === 1) leve++;
      else if (v === 2) moderado++;
      else if (v === 3) intenso++;
    }
    return { leve, moderado, intenso };
  };

  const day1Counts = countIntensities(day1Data);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="font-heading font-semibold text-xl text-levvia-fg">
          Seu Progresso Visual
        </h2>
        <p className="text-sm text-levvia-muted font-body mt-1">
          Compare como você se sentia no Dia 1 com hoje.
        </p>
      </div>

      {/* Side by Side */}
      <div className={`flex ${hasDay1 ? "flex-row gap-4" : "flex-col"} justify-center`}>
        {/* Day 1 */}
        {hasDay1 ? (
          <div className="flex-1 text-center">
            <p className="text-xs font-medium text-red-400 uppercase tracking-wider mb-2">
              Dia 1
            </p>
            <HeatMapInteractive
              readOnly
              size="small"
              initialData={day1Data as Record<string, number>}
              showHydrationAura
            />
            <div className="flex gap-1 justify-center mt-2 flex-wrap">
              {day1Counts.leve > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                  Leve: {day1Counts.leve}
                </span>
              )}
              {day1Counts.moderado > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  Moderado: {day1Counts.moderado}
                </span>
              )}
              {day1Counts.intenso > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                  Intenso: {day1Counts.intenso}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="levvia-card p-4 text-center mb-4">
            <p className="text-sm text-levvia-muted font-body">
              Dados do Dia 1 não disponíveis
            </p>
          </div>
        )}

        {/* Today */}
        <div className={`${hasDay1 ? "flex-1" : ""} text-center`}>
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
            Hoje
          </p>
          {todayData || isReviewMode ? (
            <HeatMapInteractive
              readOnly
              size="small"
              initialData={todayData || undefined}
              showHydrationAura
            />
          ) : (
            <HeatMapInteractive
              size="small"
              onNext={handleTodayComplete}
              showHydrationAura
            />
          )}
        </div>
      </div>

      {/* Improvement Summary */}
      {summary && (
        <motion.div
          className="levvia-card p-5 space-y-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2 justify-center flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
              ↓ Melhoraram: {summary.improved}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-levvia-muted font-medium">
              = Iguais: {summary.same}
            </span>
            {summary.worsened > 0 && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                ↑ Pioraram: {summary.worsened}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-center font-body">
            {summary.improved > summary.worsened ? (
              <span className="text-primary">
                Seu fogo está diminuindo. O fluxo está vencendo! 🌊
              </span>
            ) : (
              <span className="text-levvia-fg">
                Cada corpo tem seu ritmo. Continue cuidando de si — a leveza virá. 💙
              </span>
            )}
          </p>
        </motion.div>
      )}

      {/* Continue Button */}
      {todayData && !isReviewMode && (
        <button
          onClick={onNext}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm font-body"
        >
          Continuar →
        </button>
      )}
    </motion.div>
  );
};

export default HeatMapComparative;
