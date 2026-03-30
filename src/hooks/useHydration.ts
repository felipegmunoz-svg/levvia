import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UseHydrationReturn {
  dailyGoalMl: number;
  subGoalMl: number;
  currentIntakeMl: number;
  dailyPercent: number;
  addWater: (ml: number) => void;
  slotPercent: (slotIndex: number) => number;
}

export function useHydration(weightKg: number | null, dayNumber: number): UseHydrationReturn {
  const { user } = useAuth();

  const dailyGoalMl = useMemo(() => Math.round((weightKg || 60) * 35), [weightKg]);
  const subGoalMl = useMemo(() => Math.round(dailyGoalMl / 4), [dailyGoalMl]);

  const storageKey = `levvia_hydration_day_${dayNumber}`;

  const [currentIntakeMl, setCurrentIntakeMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Sync from localStorage when dayNumber changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCurrentIntakeMl(saved ? parseInt(saved, 10) || 0 : 0);
    } catch {
      setCurrentIntakeMl(0);
    }
  }, [storageKey]);

  // Restore from Supabase when localStorage is empty
  useEffect(() => {
    if (!user?.id || currentIntakeMl > 0) return;
    (async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("challenge_progress")
          .eq("id", user.id)
          .maybeSingle();

        const existing = (profile?.challenge_progress as any) || {};
        const dayKey = `day${dayNumber}`;
        const saved = existing?.touchpoints?.[dayKey]?.water_intake_ml;
        if (saved && typeof saved === "number" && saved > 0) {
          setCurrentIntakeMl(saved);
          try {
            localStorage.setItem(storageKey, String(saved));
          } catch {}
        }
      } catch {
        // silently ignore — localStorage value stays as fallback
      }
    })();
  }, [user?.id, dayNumber, storageKey]);

  const dailyPercent = useMemo(
    () => Math.min(currentIntakeMl / dailyGoalMl, 1),
    [currentIntakeMl, dailyGoalMl]
  );

  const slotPercent = useCallback(
    (slotIndex: number) => {
      const slotStart = slotIndex * subGoalMl;
      const slotEnd = slotIndex === 3 ? dailyGoalMl : (slotIndex + 1) * subGoalMl;
      const slotRange = slotEnd - slotStart;
      if (slotRange <= 0) return 1;
      const consumed = Math.max(0, currentIntakeMl - slotStart);
      return Math.min(consumed / slotRange, 1);
    },
    [currentIntakeMl, subGoalMl, dailyGoalMl]
  );

  const addWater = useCallback(
    (ml: number) => {
      const newValue = currentIntakeMl + ml;
      setCurrentIntakeMl(newValue);

      // Persist to localStorage immediately
      try {
        localStorage.setItem(storageKey, String(newValue));
      } catch {}

      // Persist to Supabase (merge into challenge_progress)
      if (user?.id) {
        const userId = user.id;
        (async () => {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("challenge_progress")
              .eq("id", userId)
              .maybeSingle();

            const existing = (profile?.challenge_progress as any) || {};
            const touchpoints = existing.touchpoints || {};
            const dayKey = `day${dayNumber}`;
            const dayData = touchpoints[dayKey] || {};

            const merged = {
              ...existing,
              touchpoints: {
                ...touchpoints,
                [dayKey]: {
                  ...dayData,
                  water_intake_ml: newValue,
                },
              },
            };

            await supabase
              .from("profiles")
              .update({ challenge_progress: merged } as any)
              .eq("id", userId);
          } catch (err) {
            console.warn("Hydration save failed:", err);
          }
        })();
      }
    },
    [currentIntakeMl, storageKey, user?.id, dayNumber]
  );

  return { dailyGoalMl, subGoalMl, currentIntakeMl, dailyPercent, addWater, slotPercent };
}
