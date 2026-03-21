import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  parseOnboardingFromLocal,
  parseOnboardingFromSupabase,
  type UserProfile,
} from "@/lib/profileEngine";

let profileCache: { userId: string; profile: UserProfile; timestamp: number } | null = null;
const PROFILE_CACHE_TTL = 60_000; // 60 seconds

function getCachedProfile(userId: string | undefined): UserProfile | null {
  if (
    profileCache &&
    profileCache.userId === (userId ?? "") &&
    Date.now() - profileCache.timestamp < PROFILE_CACHE_TTL
  ) {
    console.log("✅ [Cache] Perfil carregado do cache");
    return profileCache.profile;
  }
  return null;
}

export function useProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile>(() => {
    return getCachedProfile(user?.id) ?? parseOnboardingFromLocal();
  });

  const [loading, setLoading] = useState(() => {
    return getCachedProfile(user?.id) === null;
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    if (user?.id) {
      const p = await parseOnboardingFromSupabase(user.id);
      setProfile(p);
      profileCache = { userId: user.id, profile: p, timestamp: Date.now() };
    } else {
      const p = parseOnboardingFromLocal();
      setProfile(p);
      profileCache = { userId: "", profile: p, timestamp: Date.now() };
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (getCachedProfile(user?.id)) {
      setProfile(profileCache!.profile);
      setLoading(false);
      return;
    }
    refresh();
  }, [refresh, user?.id]);

  return { profile, loading, refresh };
}
