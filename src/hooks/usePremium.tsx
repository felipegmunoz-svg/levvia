import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { debugRender } from "@/lib/renderDebug";

export function usePremium() {
  const { user } = useAuth();
  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const renderCount = useRef(0);
  renderCount.current++;
  debugRender("usePremium", { userId: user?.id, hasPremium, loading, renderNum: renderCount.current });
  const { user } = useAuth();
  const [hasPremium, setHasPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setHasPremium(false);
      setLoading(false);
      return;
    }

    const check = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("has_premium")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        setHasPremium((data as any)?.has_premium === true);
      } catch (err) {
        console.warn("⚠️ usePremium — erro ao verificar:", err);
        setHasPremium(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [user?.id]);

  return { hasPremium, loading };
}
