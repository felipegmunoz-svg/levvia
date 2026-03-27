import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface DayHistoryItem {
  day: number;
  lightnessScore: number | null;
  notes: string;
  waterMl: number;
  nightDone: boolean;
}

export interface CelebrationData {
  userName: string;
  totalLiters: number;
  totalMovementMinutes: number;
  day1Score: number | null;
  day14Score: number | null;
  lightnessScores: { day: number; score: number }[];
  dayHistory: DayHistoryItem[];
  day1HeatMapData: Record<string, number> | null;
  loading: boolean;
}

export function useCelebrationData(): CelebrationData {
  const { user } = useAuth();
  const [data, setData] = useState<Omit<CelebrationData, "loading">>({
    userName: "",
    totalLiters: 0,
    totalMovementMinutes: 0,
    day1Score: null,
    day14Score: null,
    lightnessScores: [],
    dayHistory: [],
    day1HeatMapData: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function load() {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("challenge_progress, name, email")
          .eq("id", user!.id)
          .maybeSingle();

        const cp = (profile?.challenge_progress as any) ?? {};
        const touchpoints = cp?.touchpoints ?? {};

        let totalWaterMl = 0;
        let morningDone = 0;
        let afternoonDone = 0;
        const lightnessScores: { day: number; score: number }[] = [];
        const dayHistory: DayHistoryItem[] = [];

        for (let d = 1; d <= 14; d++) {
          const dayData = touchpoints[`day${d}`] ?? {};
          const waterMl = dayData.water_intake_ml ?? 0;
          totalWaterMl += waterMl;
          if (dayData.morning?.done) morningDone++;
          if (dayData.afternoon?.done) afternoonDone++;
          const score = dayData.night?.diary?.journal?.lightnessScore ?? null;
          if (score != null) lightnessScores.push({ day: d, score });
          dayHistory.push({
            day: d,
            lightnessScore: score,
            notes: dayData.night?.diary?.journal?.notes ?? "",
            waterMl,
            nightDone: dayData.night?.done === true,
          });
        }

        const day1Score = lightnessScores.find((x) => x.day === 1)?.score ?? null;
        const day14Score =
          [...lightnessScores].reverse().find((x) => x.score != null)?.score ?? null;
        const totalLiters = parseFloat((totalWaterMl / 1000).toFixed(1));
        const totalMovementMinutes = morningDone * 15 + afternoonDone * 5;
        const day1HeatMapData =
          touchpoints.day1?.night?.heatmap ??
          touchpoints.day1?.night?.diary?.heatmap ??
          null;

        const rawName = profile?.name ?? profile?.email ?? "Guerreira";
        const userName = rawName.split("@")[0].split(" ")[0];

        setData({
          userName,
          totalLiters,
          totalMovementMinutes,
          day1Score,
          day14Score,
          lightnessScores,
          dayHistory,
          day1HeatMapData,
        });
      } catch (err) {
        console.error("useCelebrationData error:", err);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [user?.id]);

  return { ...data, loading };
}
