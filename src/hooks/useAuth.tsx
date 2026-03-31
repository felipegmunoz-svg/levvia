import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { debugRender, debugMount, debugUnmount, debugEvent } from "@/lib/renderDebug";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  authLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  authLoading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const renderCount = useRef(0);
  renderCount.current++;
  debugRender("AuthProvider", { renderNum: renderCount.current });

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  // Track the current user id to detect real identity changes
  const currentUserIdRef = useRef<string | null>(null);
  // Track whether initial auth resolution is done
  const initializedRef = useRef(false);

  useEffect(() => {
    debugMount("AuthProvider");

    const clearJourneyCaches = () => {
      localStorage.removeItem("levvia_challenge_start");
      localStorage.removeItem("levvia_challenge_progress");
      localStorage.removeItem("levvia_day1_diary");
      localStorage.removeItem("levvia_day1_local_completed");
      localStorage.removeItem("levvia_day2_progress");
      localStorage.removeItem("levvia_day2_map_data");
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;
      const nextUserId = nextUser?.id ?? null;
      const prevUserId = currentUserIdRef.current;

      debugEvent("AuthProvider", `onAuthStateChange: ${_event}`, {
        nextUserId,
        prevUserId,
        initialized: initializedRef.current,
      });

      // ─── SIGNED_OUT: always honor ───
      if (_event === "SIGNED_OUT") {
        clearJourneyCaches();
        currentUserIdRef.current = null;
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setAuthLoading(false);
        setRoleLoading(false);
        return;
      }

      // ─── TOKEN_REFRESHED: update session ref silently, never touch loading ───
      if (_event === "TOKEN_REFRESHED") {
        debugEvent("AuthProvider", "TOKEN_REFRESHED — silent update, no loading reset");
        setSession(nextSession);
        // Don't touch user, loading, or role state
        return;
      }

      // ─── SIGNED_IN / INITIAL_SESSION ───
      if (_event === "SIGNED_IN" || _event === "INITIAL_SESSION") {
        const isRealIdentityChange = nextUserId !== prevUserId;

        if (isRealIdentityChange) {
          // Real login or first load: update everything
          debugEvent("AuthProvider", `Real identity change: ${prevUserId} → ${nextUserId}`);
          currentUserIdRef.current = nextUserId;
          clearJourneyCaches();
          setSession(nextSession);
          setUser(nextUser);
          setAuthLoading(false);
          // roleLoading will be set to true by the role useEffect
          setRoleLoading(!!nextUser);
        } else {
          // Same user — redundant SIGNED_IN (silent refresh). Ignore.
          debugEvent("AuthProvider", `Redundant ${_event} for same user — IGNORED. No loading reset.`);
          // Update session object silently (new token), but don't touch loading
          setSession(nextSession);
        }
        return;
      }

      // ─── Any other event: update session/user only if changed ───
      debugEvent("AuthProvider", `Other event: ${_event}`);
      setSession(prev => prev?.access_token === nextSession?.access_token ? prev : nextSession);
      setUser(prev => prev?.id === nextUser?.id ? prev : nextUser);
    });

    // Initial session fetch
    void supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      const currentUser = currentSession?.user ?? null;
      debugEvent("AuthProvider", "getSession resolved", { userId: currentUser?.id });

      currentUserIdRef.current = currentUser?.id ?? null;
      initializedRef.current = true;
      setSession(currentSession);
      setUser(currentUser);
      setAuthLoading(false);
      setRoleLoading(!!currentUser);
    });

    return () => {
      debugUnmount("AuthProvider");
      subscription.unsubscribe();
    };
  }, []);

  // ─── Role loading: only when user.id actually changes ───
  const prevRoleUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (authLoading) return;

    if (!user?.id) {
      setIsAdmin(false);
      setRoleLoading(false);
      prevRoleUserIdRef.current = null;
      return;
    }

    // Skip if we already loaded roles for this exact user
    if (user.id === prevRoleUserIdRef.current) {
      debugEvent("AuthProvider", `Role check skipped — same user ${user.id}`);
      return;
    }

    debugEvent("AuthProvider", `Loading admin role for user ${user.id}`);
    setRoleLoading(true);
    prevRoleUserIdRef.current = user.id;

    const loadAdminState = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!cancelled) {
        setIsAdmin(!error && !!data);
        setRoleLoading(false);
      }
    };

    void loadAdminState();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  const loading = authLoading || roleLoading;

  const signOut = async () => {
    localStorage.removeItem("levvia_challenge_start");
    localStorage.removeItem("levvia_challenge_progress");
    localStorage.removeItem("levvia_day1_diary");
    localStorage.removeItem("levvia_day1_local_completed");
    localStorage.removeItem("levvia_day2_progress");
    localStorage.removeItem("levvia_day2_map_data");
    await supabase.auth.signOut();
    currentUserIdRef.current = null;
    prevRoleUserIdRef.current = null;
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setRoleLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, authLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
