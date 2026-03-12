import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  parseOnboardingFromLocal,
  parseOnboardingFromSupabase,
  type UserProfile,
} from "@/lib/profileEngine";

/**
 * Hook that provides the user's profile data.
 * Tries Supabase first, falls back to localStorage.
 */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(parseOnboardingFromLocal());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    if (user?.id) {
      const p = await parseOnboardingFromSupabase(user.id);
      setProfile(p);
    } else {
      setProfile(parseOnboardingFromLocal());
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, loading, refresh };
}
