import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { saveWithRetry } from "@/lib/saveWithRetry";
import type { TouchpointSlot } from "@/data/touchpointConfig";

export interface DiaryData {
  notes?: string;
  guilt_before?: number;
  guilt_after?: number;
  leg_sensation?: string;
}

export interface SlotProgress {
  done: boolean;
  doneAt: string | null;
  diary?: DiaryData;
}

export interface DayTouchpointProgress {
  morning: SlotProgress;
  lunch: SlotProgress;
  afternoon: SlotProgress;
  night: SlotProgress;
}

const emptySlot: SlotProgress = { done: false, doneAt: null };

const emptyProgress: DayTouchpointProgress = {
  morning: { ...emptySlot },
  lunch: { ...emptySlot },
  afternoon: { ...emptySlot },
  night: { ...emptySlot },
};

function localKey(day: number) {
  return `levvia_tp_day_${day}`;
}

function loadLocal(day: number): DayTouchpointProgress | null {
  try {
    const raw = localStorage.getItem(localKey(day));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocal(day: number, data: DayTouchpointProgress) {
  try {
    localStorage.setItem(localKey(day), JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

function mergeProgress(
  local: DayTouchpointProgress | null,
  remote: DayTouchpointProgress | null
): DayTouchpointProgress {
  if (!local && !remote) return { ...emptyProgress, morning: { ...emptySlot }, lunch: { ...emptySlot }, afternoon: { ...emptySlot }, night: { ...emptySlot } };
  if (!local) return remote!;
  if (!remote) return local;

  // Merge each slot — pick the one that is done, or the one with the latest timestamp
  const slots: TouchpointSlot[] = ["morning", "lunch", "afternoon", "night"];
  const merged = { ...emptyProgress } as DayTouchpointProgress;

  for (const slot of slots) {
    const l = local[slot];
    const r = remote[slot];

    if (r.done && !l.done) {
      merged[slot] = r;
    } else if (l.done && !r.done) {
      merged[slot] = l;
    } else if (l.done && r.done) {
      // Both done — pick the one with earlier timestamp (first completion wins)
      const lTime = l.doneAt ? new Date(l.doneAt).getTime() : 0;
      const rTime = r.doneAt ? new Date(r.doneAt).getTime() : 0;
      merged[slot] = rTime > 0 && rTime < lTime ? r : l;
    } else {
      merged[slot] = { ...emptySlot };
    }
  }

  return merged;
}

export function useTouchpointProgress(dayNumber: number) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<DayTouchpointProgress>(
    () => loadLocal(dayNumber) ?? {
      morning: { ...emptySlot },
      lunch: { ...emptySlot },
      afternoon: { ...emptySlot },
      night: { ...emptySlot },
    }
  );
  const [loading, setLoading] = useState(true);

  // Load from Supabase and merge with local
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("challenge_progress")
          .eq("id", user.id)
          .maybeSingle();

        if (cancelled) return;

        if (!error && data?.challenge_progress) {
          const cp = data.challenge_progress as Record<string, any>;
          const remote = cp?.touchpoints?.[`day${dayNumber}`] as DayTouchpointProgress | undefined;
          const local = loadLocal(dayNumber);
          const merged = mergeProgress(local, remote ?? null);

          setProgress(merged);
          saveLocal(dayNumber, merged);
        }
      } catch {
        // Supabase unavailable — local state is already loaded
      }

      if (!cancelled) setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [user?.id, dayNumber]);

  const markSlotDone = useCallback(
    async (slot: TouchpointSlot, diary?: DiaryData) => {
      const now = new Date().toISOString();
      const updated: DayTouchpointProgress = {
        ...progress,
        [slot]: {
          done: true,
          doneAt: now,
          ...(diary ? { diary } : {}),
        },
      };

      setProgress(updated);
      saveLocal(dayNumber, updated);

      if (!user?.id) return;

      try {
        // Fetch current challenge_progress to merge
        const { data } = await supabase
          .from("profiles")
          .select("challenge_progress")
          .eq("id", user.id)
          .maybeSingle();

        const existing = (data?.challenge_progress as Record<string, any>) ?? {};
        const touchpoints = existing.touchpoints ?? {};

        const newCp = {
          ...existing,
          touchpoints: {
            ...touchpoints,
            [`day${dayNumber}`]: updated,
          },
        };

        await saveWithRetry({
          table: "profiles",
          userId: user.id,
          data: { challenge_progress: newCp },
        });
      } catch (err) {
        console.error("❌ Failed to persist touchpoint progress:", err);
      }
    },
    [progress, dayNumber, user?.id]
  );

  const activeSlot = useMemo<TouchpointSlot>(() => {
    if (!progress.morning.done) return "morning";
    if (!progress.lunch.done) return "lunch";
    if (!progress.afternoon.done) return "afternoon";
    return "night";
  }, [progress]);

  const isDayComplete = useMemo(() => {
    return progress.night.done === true;
  }, [progress.night.done]);

  const completedSlots = useMemo(() => {
    return (["morning", "lunch", "afternoon", "night"] as TouchpointSlot[]).filter(
      (s) => progress[s].done
    ).length;
  }, [progress]);

  return {
    progress,
    activeSlot,
    isDayComplete,
    completedSlots,
    markSlotDone,
    loading,
  };
}
