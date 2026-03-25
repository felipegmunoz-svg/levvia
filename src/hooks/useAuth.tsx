import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { debugRender, debugMount, debugUnmount, debugEvent } from "@/lib/renderDebug";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
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
      if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
        setRoleLoading(!!nextUser);
        // Clear stale journey caches so backend is re-fetched
        clearJourneyCaches();
      }
      if (_event === 'SIGNED_OUT') {
        clearJourneyCaches();
      }
      setSession(prev => prev?.access_token === nextSession?.access_token ? prev : nextSession);
      setUser(prev => prev?.id === nextUser?.id ? prev : nextUser);
      setAuthLoading(false);
    });

    void supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      const currentUser = currentSession?.user ?? null;
      setRoleLoading(!!currentUser);
      setSession(currentSession);
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (authLoading) return;

    if (!user?.id) {
      setIsAdmin(false);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);

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
    // Clear journey caches before sign-out
    localStorage.removeItem("levvia_challenge_start");
    localStorage.removeItem("levvia_challenge_progress");
    localStorage.removeItem("levvia_day1_diary");
    localStorage.removeItem("levvia_day1_local_completed");
    localStorage.removeItem("levvia_day2_progress");
    localStorage.removeItem("levvia_day2_map_data");
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setRoleLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
