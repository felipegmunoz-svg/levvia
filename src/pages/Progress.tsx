import { useState, useEffect, useMemo } from "react";
import BottomNav from "@/components/BottomNav";
import FlowSilhouette, { calculateFlowScore } from "@/components/FlowSilhouette";
import { useHydration } from "@/hooks/useHydration";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";

const EMPTY_HEAT_MAP: Record<string, number> = {};

const Progress = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [challengeProgress, setChallengeProgress] = useState<any>(null);

  // Fetch challenge_progress for evolution data
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("challenge_progress")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.challenge_progress) {
        setChallengeProgress(data.challenge_progress);
      }
    })();
  }, [user?.id]);

  // Derive current heat map: Day 7 data > Day 1 fallback
  const currentHeatMap = useMemo(() => {
    const day7Night = challengeProgress?.touchpoints?.day7?.night;
    if (day7Night && typeof day7Night === "object") {
      // Check for heat map data stored from HeatMapComparative
      const heatData = day7Night.heatMapToday || day7Night.heatmap;
      if (heatData && Object.keys(heatData).length > 0) return heatData as Record<string, number>;
    }
    if (profile?.heatMapDay1 && Object.keys(profile.heatMapDay1).length > 0) {
      return profile.heatMapDay1;
    }
    return EMPTY_HEAT_MAP;
  }, [challengeProgress, profile?.heatMapDay1]);

  // Compute current day number
  const dayNumber = useMemo(() => {
    if (!profile) return 1;
    const start = (profile as any).challengeStart;
    if (!start) return 1;
    const diff = Math.floor((Date.now() - new Date(start).getTime()) / 86400000);
    return Math.max(1, Math.min(diff + 1, 14));
  }, [profile]);

  const { currentIntakeMl, dailyGoalMl } = useHydration(profile?.weightKg ?? null, dayNumber);

  const flowScore = calculateFlowScore(currentHeatMap || {});
  const scoreColor = flowScore <= 40 ? "#EF4444" : flowScore <= 70 ? "#F59E0B" : "#2EC4B6";
  const scoreLabel = flowScore <= 40 ? "🔥 Fogo Ativo" : flowScore <= 70 ? "🌊 Em Transição" : "💧 Fluxo Ativo";
  const scoreMessage =
    flowScore <= 40
      ? "Sua inflamação precisa de atenção. Continue a jornada, cada ação conta."
      : flowScore <= 70
      ? "Você está no caminho certo. O fogo está diminuindo."
      : "Excelente! Seu fluxo está ativo e a inflamação controlada.";

  // Build evolution data from challenge_progress
  const evoData = useMemo(() => {
    const touchpoints = challengeProgress?.touchpoints;
    if (!touchpoints) {
      // Fallback static data
      return [
        { day: "Dia 1", value: 80, color: "#EF4444" },
        { day: "Dia 2", value: 70, color: "#F59E0B" },
        { day: "Dia 3", value: 65, color: "#F59E0B" },
        { day: "Dia 4", value: 60, color: "#F59E0B" },
        { day: "Dia 5", value: 55, color: "#2EC4B6" },
      ];
    }

    const days: { day: string; value: number; color: string }[] = [];
    for (let d = 1; d <= 14; d++) {
      const dayData = touchpoints[`day${d}`];
      if (!dayData) continue;
      // Try to extract a heat map score from the day's data
      let heatMap: Record<string, number> | null = null;
      if (dayData.night?.heatMapToday) heatMap = dayData.night.heatMapToday;
      else if (dayData.night?.heatmap) heatMap = dayData.night.heatmap;

      let score: number;
      if (heatMap && Object.keys(heatMap).length > 0) {
        score = calculateFlowScore(heatMap || {});
      } else {
        // Estimate from completion — simple heuristic
        const completed = dayData.completed;
        score = completed ? Math.min(50 + d * 4, 95) : 50;
      }

      const color = score > 70 ? "#2EC4B6" : score > 40 ? "#F59E0B" : "#EF4444";
      days.push({ day: `Dia ${d}`, value: score, color });
    }

    return days.length > 0 ? days : [
      { day: "Dia 1", value: 80, color: "#EF4444" },
      { day: "Dia 2", value: 70, color: "#F59E0B" },
      { day: "Dia 3", value: 65, color: "#F59E0B" },
    ];
  }, [challengeProgress]);

  const hydrationPercent = dailyGoalMl > 0 ? Math.min(currentIntakeMl / dailyGoalMl, 1) : 0;
  const goalReached = currentIntakeMl >= dailyGoalMl && dailyGoalMl > 0;

  return (
    <div className="theme-light levvia-page min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src={logoIcon} alt="Levvia" className="h-7" />
        </div>
        <h1 className="text-[26px] font-heading font-semibold text-levvia-fg tracking-tight">
          Seu Progresso
        </h1>
        <p className="text-[13px] text-levvia-muted font-body mt-1">
          Acompanhe sua evolução
        </p>
      </header>

      <main className="px-5 space-y-5">
        {/* FlowSilhouette — replaces old donut chart */}
        <FlowSilhouette
          heatMapData={currentHeatMap}
          waterIntakeMl={currentIntakeMl}
          waterGoalMl={dailyGoalMl}
          size="large"
          animated={true}
        />

        {/* Score context */}
        <div className="levvia-card p-5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg font-heading font-semibold" style={{ color: scoreColor }}>
              {scoreLabel}
            </span>
          </div>
          <p className="text-[13px] text-levvia-muted font-body text-center leading-relaxed">
            {scoreMessage}
          </p>

          {/* Legend */}
          <div className="mt-5 space-y-2">
            {[
              { color: "#EF4444", range: "0-40", label: "Fogo Ativo (precisa atenção)" },
              { color: "#F59E0B", range: "41-70", label: "Em Transição (caminho certo)" },
              { color: "#2EC4B6", range: "71-100", label: "Fluxo Ativo (bom progresso)" },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-[11px] text-levvia-muted font-body">
                  {item.range}: {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Evolução Mapa de Calor */}
        <div className="levvia-card p-6">
          <h2 className="text-[14px] font-heading font-semibold text-levvia-fg mb-5">
            📊 Evolução do Fluxo
          </h2>

          <div className="space-y-3">
            {evoData.map((item) => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-levvia-fg font-body w-12 shrink-0">
                  {item.day}:
                </span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
                <span className="text-[11px] text-levvia-muted font-body w-8 text-right">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-levvia-muted font-body">
            <span>🔥</span>
            <span>Fogo diminuindo</span>
            <span>→</span>
            <span>Fluxo aumentando</span>
            <span>💧</span>
          </div>
        </div>

        {/* Hydration Summary */}
        <div className="levvia-card p-5">
          <h2 className="text-[14px] font-heading font-semibold text-levvia-fg mb-4">
            💧 Hidratação Hoje
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${hydrationPercent * 100}%` }}
              />
            </div>
            <span className="text-xs text-levvia-muted font-body whitespace-nowrap">
              {currentIntakeMl}ml / {dailyGoalMl}ml
            </span>
          </div>
          {goalReached && (
            <div className="mt-3 text-center">
              <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                Meta atingida! 🎉
              </span>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Progress;
