import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Day2Welcome from "./Day2Welcome";
import Day2DrainageGuide from "./Day2DrainageGuide";
import Day2InflammationMap from "./Day2InflammationMap";
import Day2MealSuggestion from "./Day2MealSuggestion";
import Day2NightRitual from "./Day2NightRitual";
import Day2Closing from "./Day2Closing";

type Day2Step = "loading" | "welcome" | "drainage" | "map" | "meal" | "night" | "closing";

interface Day2FlowProps {
  onComplete: () => void;
}

const STEPS_ORDER: Day2Step[] = ["welcome", "drainage", "map", "meal", "night", "closing"];

const Day2Flow = ({ onComplete }: Day2FlowProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [step, setStep] = useState<Day2Step>("loading");
  const [mapData, setMapData] = useState<any>(null);

  // Determine starting step from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("levvia_day2_progress");
    if (saved) {
      try {
        const { lastStep } = JSON.parse(saved);
        if (STEPS_ORDER.includes(lastStep)) {
          console.log("📂 Day2Flow — Retomando do passo:", lastStep);
          setStep(lastStep);
          return;
        }
      } catch {}
    }
    setStep("welcome");
  }, []);

  const goTo = (nextStep: Day2Step) => {
    console.log(`🔄 Day2Flow — ${step} → ${nextStep}`);
    localStorage.setItem(
      "levvia_day2_progress",
      JSON.stringify({ lastStep: nextStep, timestamp: new Date().toISOString() })
    );
    setStep(nextStep);
  };

  const handleDay2Complete = async () => {
    if (!user?.id) return;

    console.log("💾 Day2Flow — Salvando conclusão do Dia 2...");
    const updatePayload: any = {
      day2_completed: true,
      day2_completed_at: new Date().toISOString(),
    };
    if (mapData) {
      updatePayload.day2_inflammation_map = mapData;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id);

    if (error) {
      console.error("❌ Erro ao salvar Dia 2:", error);
    } else {
      console.log("✅ Dia 2 concluído com sucesso");
      localStorage.removeItem("levvia_day2_progress");
      onComplete();
    }
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === "welcome") return <Day2Welcome onNext={() => goTo("drainage")} />;
  if (step === "drainage") return <Day2DrainageGuide onNext={() => goTo("map")} />;
  if (step === "map") {
    return (
      <Day2InflammationMap
        onComplete={(data) => {
          setMapData(data);
          goTo("meal");
        }}
      />
    );
  }
  if (step === "meal") return <Day2MealSuggestion profile={profile} onNext={() => goTo("night")} />;
  if (step === "night") return <Day2NightRitual onNext={() => goTo("closing")} />;
  if (step === "closing") return <Day2Closing onComplete={handleDay2Complete} />;

  return null;
};

export default Day2Flow;
