import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export function useTrialStatus() {
  const { user } = useAuth();
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);

  const currentDay = useMemo(() => {
    const start = localStorage.getItem("levvia_challenge_start");
    if (!start) return 1;
    const diff = Date.now() - new Date(start).getTime();
    return Math.min(Math.max(Math.floor(diff / 86400000) + 1, 1), 14);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setHasSubscription(false);
      return;
    }

    supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .then(({ data }) => {
        setHasSubscription(!!data && data.length > 0);
      });
  }, [user?.id]);

  const isInTrial = currentDay <= 3 && hasSubscription === false;

  return { isInTrial, currentDay };
}
