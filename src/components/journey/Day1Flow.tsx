import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Day1Welcome from "./Day1Welcome";
import HeatMapInteractive from "./HeatMapInteractive";
import Day1MealSuggestion from "./Day1MealSuggestion";
import Day1Closing from "./Day1Closing";

interface Day1FlowProps {
  onComplete: () => void;
}

/**
 * Orchestrates the 5-moment Day 1 journey.
 * Steps: 1=Welcome, 2=HeatMap, 3=Onboarding(redirect), 4=MealSuggestion, 5=Closing
 */
const Day1Flow = ({ onComplete }: Day1FlowProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine which step to show based on saved state
  useEffect(() => {
    const determineStep = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("day1_welcome_shown, heat_map_day1, day1_completed, onboarding_data")
        .eq("id", user.id)
        .single();

      if (!data) {
        setStep(1);
        setLoading(false);
        return;
      }

      // Already completed
      if ((data as any).day1_completed) {
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
        setStep(4);
      }

      setLoading(false);
    };

    determineStep();
  }, [user?.id, onComplete]);

  const handleWelcomeDone = async () => {
    if (user?.id) {
      await supabase
        .from("profiles")
        .update({ day1_welcome_shown: true } as any)
        .eq("id", user.id);
    }
    setStep(2);
  };

  const handleHeatMapDone = async (heatMap: Record<string, number>) => {
    if (user?.id) {
      await supabase
        .from("profiles")
        .update({ heat_map_day1: heatMap } as any)
        .eq("id", user.id);
    }

    // Check if onboarding is done
    const onboardingDone = localStorage.getItem("levvia_onboarded") === "true";
    if (!onboardingDone) {
      // Redirect to onboarding, will come back to /today after
      navigate("/onboarding", { replace: true });
    } else {
      setStep(4);
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
  // Step 3 = redirect to onboarding (handled in handleHeatMapDone)
  if (step === 4) return <Day1MealSuggestion profile={profile} onNext={() => setStep(5)} />;
  if (step === 5 && user?.id) return <Day1Closing userId={user.id} onComplete={onComplete} />;

  return null;
};

export default Day1Flow;
