import { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { readOnboardingSnapshot, syncOnboardingToSupabase } from "@/lib/syncOnboarding";
import { toast } from "sonner";
import Day1Welcome from "./Day1Welcome";
import HeatMapInteractive from "./HeatMapInteractive";
import Day1MealSuggestion from "./Day1MealSuggestion";
import Day1Closing from "./Day1Closing";
import BottomNav from "@/components/BottomNav";
import logoFull from "@/assets/logo_livvia_azul.png";

interface Day1FlowProps {
  onComplete: () => void;
  isReviewMode?: boolean;
}

const Day1Flow = ({ onComplete, isReviewMode = false }: Day1FlowProps) => {
  
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const syncAttempted = useRef(false);
  const [savedHeatMap, setSavedHeatMap] = useState<Record<string, number> | null>(null);

  // In review mode, fetch saved data and skip normal flow
  useEffect(() => {
    if (!isReviewMode) return;
    
    const fetchReviewData = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("heat_map_day1")
          .eq("id", user.id)
          .maybeSingle();
        if (data?.heat_map_day1 && typeof data.heat_map_day1 === 'object') {
          setSavedHeatMap(data.heat_map_day1 as Record<string, number>);
        }
      }
      setLoading(false);
    };
    fetchReviewData();
  }, [isReviewMode, user?.id]);

  // Sync onboarding data from localStorage to Supabase (if pending)
  useEffect(() => {
    if (isReviewMode) return;
    if (!user?.id || syncAttempted.current) return;
    syncAttempted.current = true;

    const snapshot = readOnboardingSnapshot();
    if (!snapshot.hasData) return;

    console.log('🔄 Day1Flow — Sincronizando onboarding para o Supabase...');
    syncOnboardingToSupabase(snapshot, user.id, { name: undefined, phone: undefined, email: undefined })
      .then((ok) => {
        if (ok) console.log('✅ Day1Flow — Onboarding sincronizado com sucesso');
        else console.warn('⚠️ Day1Flow — Sync parcial, dados mantidos em localStorage');
      })
      .catch((e) => console.error('❌ Day1Flow — Erro no sync:', e));
  }, [user?.id, isReviewMode]);

  // Determine which step to show based on saved state (normal mode only)
  useEffect(() => {
    if (isReviewMode) return;
    
    const determineStep = async () => {
      try {
        if (!user?.id) {
          setStep(1);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("day1_welcome_shown, heat_map_day1, day1_completed, onboarding_data")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("❌ Day1Flow — erro ao buscar perfil:", error);
          setStep(1);
          return;
        }

        if (!data) {
          setStep(1);
          return;
        }

        if ((data as any).day1_completed) {
          setLoading(false);
          onComplete();
          return;
        }

        const welcomeShown = (data as any).day1_welcome_shown === true;
        const heatMapDone = (data as any).heat_map_day1 && Object.keys((data as any).heat_map_day1).length > 1;
        const onboardingDone = localStorage.getItem("levvia_onboarded") === "true";

        if (!welcomeShown) {
          setStep(1);
        } else if (!heatMapDone) {
          setStep(2);
        } else if (!onboardingDone) {
          setStep(3);
        } else {
          const localCompleted = localStorage.getItem("levvia_day1_local_completed") === "true";
          const localDiary = localStorage.getItem("levvia_day1_diary");

          if (localCompleted && localDiary && user?.id) {
            try {
              const diary = JSON.parse(localDiary);
              await supabase.from("daily_diary").insert({
                user_id: user.id,
                day_number: 1,
                leg_sensation: diary.leg_sensation,
                guilt_before: diary.guilt_before,
                guilt_after: diary.guilt_after,
                notes: diary.notes || "",
              });
              const now = new Date().toISOString();
              await supabase
                .from("profiles")
                .update({
                  day1_completed: true,
                  day1_completed_at: now,
                  challenge_start: now,
                } as any)
                .eq("id", user.id);
              localStorage.setItem("levvia_challenge_start", now);
            } catch (e) {
              console.error("Error syncing day1 diary:", e);
            }
            localStorage.removeItem("levvia_day1_diary");
            localStorage.removeItem("levvia_day1_local_completed");
            onComplete();
            return;
          }

          setStep(4);
        }
      } catch (e) {
        console.error("❌ Day1Flow — erro em determineStep:", e);
        setStep(1);
      } finally {
        setLoading(false);
      }
    };

    determineStep();
  }, [user?.id, onComplete, isReviewMode]);

  const handleWelcomeDone = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        await supabase
          .from("profiles")
          .update({ day1_welcome_shown: true } as any)
          .eq("id", user.id);
      }
      setStep(2);
    } catch (e) {
      console.error("❌ Day1Flow — erro em handleWelcomeDone:", e);
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleHeatMapDone = async (heatMap: Record<string, number>) => {
    try {
      setLoading(true);

      if (user?.id) {
        await supabase
          .from("profiles")
          .update({ heat_map_day1: heatMap } as any)
          .eq("id", user.id);
      }

      const onboardingDone = localStorage.getItem("levvia_onboarded") === "true";
      if (!onboardingDone) {
        navigate("/onboarding", { replace: true });
        return;
      }

      const localCompleted = localStorage.getItem("levvia_day1_local_completed") === "true";
      const localDiary = localStorage.getItem("levvia_day1_diary");

      if (localCompleted && localDiary && user?.id) {
        try {
          const diary = JSON.parse(localDiary);
          await supabase.from("daily_diary").insert({
            user_id: user.id,
            day_number: 1,
            leg_sensation: diary.leg_sensation,
            guilt_before: diary.guilt_before,
            guilt_after: diary.guilt_after,
            notes: diary.notes || "",
          });
          const now = new Date().toISOString();
          await supabase
            .from("profiles")
            .update({
              day1_completed: true,
              day1_completed_at: now,
              challenge_start: now,
            } as any)
            .eq("id", user.id);
          localStorage.setItem("levvia_challenge_start", now);
        } catch (e) {
          console.error("Error syncing day1 diary:", e);
        }
        localStorage.removeItem("levvia_day1_diary");
        localStorage.removeItem("levvia_day1_local_completed");
        onComplete();
        return;
      }

      setStep(4);
    } catch (e) {
      console.error("❌ Day1Flow — erro em handleHeatMapDone:", e);
      toast.error("Erro ao salvar seus dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ===== REVIEW MODE =====
  if (isReviewMode) {
    
    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="levvia-page min-h-screen pb-24">
        <div className="p-4 border-b border-levvia-border bg-white sticky top-0 z-10">
          <div className="flex justify-center">
            <img src={logoFull} alt="Levvia" className="h-10" />
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Review Header */}
          <div className="text-center space-y-2">
            <span className="text-3xl">🔥</span>
            <h1 className="text-xl font-heading font-bold text-levvia-fg">
              Dia 1: Consciência Corporal
            </h1>
            <p className="text-sm text-levvia-muted font-body">
              Revisão do seu primeiro dia de jornada
            </p>
          </div>

          {/* Heat Map - saved data */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🗺️ Seu Mapa de Calor</h2>
            {savedHeatMap && Object.keys(savedHeatMap).length > 0 ? (
              <HeatMapInteractive
                readOnly={true}
                initialData={savedHeatMap as any}
                size="small"
              />
            ) : (
              <div className="levvia-card p-4 text-center">
                <p className="text-sm text-levvia-muted">Mapa de calor não registrado</p>
              </div>
            )}
          </div>

          {/* Meal Suggestion - read only */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🍽️ Refeição Sugerida</h2>
            <Day1MealSuggestion profile={profile} onNext={() => {}} />
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate('/journey')}
            className="w-full py-3 bg-levvia-primary text-white rounded-xl font-medium font-body"
          >
            ← Voltar para Jornada
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // ===== NORMAL MODE =====
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === 1) return <Day1Welcome onNext={handleWelcomeDone} />;
  if (step === 2) return <HeatMapInteractive onNext={handleHeatMapDone} />;
  if (step === 3) return <Navigate to="/onboarding" replace />;
  if (step === 4) return <Day1MealSuggestion profile={profile} onNext={() => setStep(5)} />;
  if (step === 5 && user?.id) return <Day1Closing userId={user.id} onComplete={onComplete} />;

  return null;
};

export default Day1Flow;
