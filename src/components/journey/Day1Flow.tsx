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

interface Day1FlowProps {
  onComplete: () => void;
}

const Day1Flow = ({ onComplete }: Day1FlowProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const syncAttempted = useRef(false);

  // Sync onboarding data from localStorage to Supabase (if pending)
  useEffect(() => {
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
  }, [user?.id]);

  // Determine which step to show based on saved state
  useEffect(() => {
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
          setStep(3); // Will render <Navigate> to /onboarding
        } else {
          // Check if local diary was completed (public flow) — sync and finish
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
  }, [user?.id, onComplete]);

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

      // PRIORITY: Check onboarding FIRST — never skip it
      const onboardingDone = localStorage.getItem("levvia_onboarded") === "true";
      if (!onboardingDone) {
        navigate("/onboarding", { replace: true });
        return;
      }

      // Onboarding done — now check if there's a pre-auth diary to sync
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

      // Normal flow: proceed to meal suggestion
      setStep(4);
    } catch (e) {
      console.error("❌ Day1Flow — erro em handleHeatMapDone:", e);
      toast.error("Erro ao salvar seus dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === 1) return <Day1Welcome onNext={handleWelcomeDone} />;
  if (step === 2) return <HeatMapInteractive onNext={handleHeatMapDone} />;
  // Step 3 = onboarding not done — use <Navigate> instead of imperative navigate in render
  if (step === 3) return <Navigate to="/onboarding" replace />;
  if (step === 4) return <Day1MealSuggestion profile={profile} onNext={() => setStep(5)} />;
  if (step === 5 && user?.id) return <Day1Closing userId={user.id} onComplete={onComplete} />;

  return null;
};

export default Day1Flow;
