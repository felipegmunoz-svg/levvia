import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type RescueMode = "resgate" | "consagracao" | "neutral";

const CHECKPOINT_DAYS = [3, 6, 7, 10, 14];
const LS_KEY = "levvia_rescue_mode";

export function useRescueMode() {
  const { user } = useAuth();
  const [rescueMode, setRescueMode] = useState<RescueMode>(() => {
    return (localStorage.getItem(LS_KEY) as RescueMode) || "neutral";
  });

  // Sync from Supabase on mount
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("challenge_progress")
        .eq("id", user.id)
        .maybeSingle();
      const cp = (data?.challenge_progress as any) || {};
      const remote = cp.rescue_mode;
      if (remote?.status) {
        const localTs = localStorage.getItem("levvia_rescue_mode_ts") || "0";
        if (remote.updatedAt > localTs) {
          setRescueMode(remote.status);
          localStorage.setItem(LS_KEY, remote.status);
          localStorage.setItem("levvia_rescue_mode_ts", remote.updatedAt);
        }
      }
    })();
  }, [user?.id]);

  const isCheckpointDay = useCallback((dayNumber: number) => {
    return CHECKPOINT_DAYS.includes(dayNumber);
  }, []);

  const evaluateCheckpoint = useCallback(
    async (dayNumber: number, lightnessScore: number) => {
      if (!CHECKPOINT_DAYS.includes(dayNumber)) return;
      if (!user?.id) return;

      let newMode: RescueMode = rescueMode;
      if (lightnessScore < 5) newMode = "resgate";
      else if (lightnessScore >= 7) newMode = "consagracao";
      // 5-6 keeps current

      const now = new Date().toISOString();
      setRescueMode(newMode);
      localStorage.setItem(LS_KEY, newMode);
      localStorage.setItem("levvia_rescue_mode_ts", now);

      // Merge into challenge_progress
      const { data: profile } = await supabase
        .from("profiles")
        .select("challenge_progress")
        .eq("id", user.id)
        .maybeSingle();

      const cp = (profile?.challenge_progress as any) || {};
      const updated = {
        ...cp,
        rescue_mode: {
          status: newMode,
          updatedAt: now,
          lastCheckpointDay: dayNumber,
          lastScore: lightnessScore,
        },
      };

      await supabase
        .from("profiles")
        .update({ challenge_progress: updated } as any)
        .eq("id", user.id);
    },
    [user?.id, rescueMode]
  );

  return { rescueMode, evaluateCheckpoint, isCheckpointDay };
}
