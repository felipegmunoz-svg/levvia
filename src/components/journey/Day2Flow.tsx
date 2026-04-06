import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { saveWithRetry } from "@/lib/saveWithRetry";
import Day2Welcome from "./Day2Welcome";
import Day2DrainageGuide from "./Day2DrainageGuide";
import Day2InflammationMap from "./Day2InflammationMap";
import Day2MealSuggestion from "./Day2MealSuggestion";
import Day2NightRitual from "./Day2NightRitual";
import Day2Closing from "./Day2Closing";
import BottomNav from "@/components/BottomNav";
import logoFull from "@/assets/logo_livvia_azul.png";

type Day2Step = "loading" | "welcome" | "drainage" | "map" | "meal" | "night" | "closing";

interface Day2FlowProps {
  onComplete: () => void;
  isReviewMode?: boolean;
}

const STEPS_ORDER: Day2Step[] = ["welcome", "drainage", "map", "meal", "night", "closing"];

const Day2Flow = ({ onComplete, isReviewMode = false }: Day2FlowProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState<Day2Step>("loading");
  const [mapData, setMapData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Restore mapData from localStorage on mount
  useEffect(() => {
    if (isReviewMode) return;
    const savedMap = localStorage.getItem("levvia_day2_map_data");
    if (savedMap) {
      try {
        setMapData(JSON.parse(savedMap));
      } catch {}
    }
  }, [isReviewMode]);

  // Determine starting step from localStorage
  useEffect(() => {
    if (isReviewMode) return;
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
  }, [isReviewMode]);

  const goTo = (nextStep: Day2Step) => {
    console.log(`🔄 Day2Flow — ${step} → ${nextStep}`);
    localStorage.setItem(
      "levvia_day2_progress",
      JSON.stringify({ lastStep: nextStep, timestamp: new Date().toISOString() })
    );
    setStep(nextStep);
  };

  const handleMapComplete = async (data: any) => {
    console.log("🗺️ handleMapComplete — dados recebidos:", JSON.stringify(data));
    
    if (!data || (!data.markedAreas?.length && !Object.keys(data.notes || {}).length)) {
      console.warn("⚠️ handleMapComplete — dados vazios, pulando save");
      goTo("meal");
      return;
    }

    setMapData(data);
    localStorage.setItem("levvia_day2_map_data", JSON.stringify(data));
    
    if (user?.id) {
      const success = await saveWithRetry({
        userId: user.id,
        data: { day2_inflammation_map: data },
      });
      console.log(`🗺️ handleMapComplete — save result: ${success ? "✅" : "❌"}`);
    }
    
    goTo("meal");
  };

  const handleDay2Complete = async () => {
    if (!user?.id) return;
    setSaving(true);

    console.log("💾 Day2Flow — Salvando conclusão do Dia 2...");
    
    let finalMapData = mapData;
    if (!finalMapData) {
      const savedMap = localStorage.getItem("levvia_day2_map_data");
      if (savedMap) {
        try { finalMapData = JSON.parse(savedMap); } catch {}
      }
    }

    const updatePayload: any = {
      day2_completed: true,
      day2_completed_at: new Date().toISOString(),
    };
    if (finalMapData) {
      updatePayload.day2_inflammation_map = finalMapData;
    }

    const success = await saveWithRetry({
      userId: user.id,
      data: updatePayload,
      onRetry: () => handleDay2Complete(),
    });

    setSaving(false);

    if (success) {
      console.log("✅ Dia 2 concluído com sucesso");
      localStorage.removeItem("levvia_day2_progress");
      localStorage.removeItem("levvia_day2_map_data");
      onComplete();
    }
  };

  // ===== REVIEW MODE =====
  if (isReviewMode) {
    return (
      <div className="levvia-page min-h-screen pb-24">
        <div className="p-4 border-b border-levvia-border bg-white sticky top-0 z-10">
          <div className="flex justify-center">
            <img src={logoFull} alt="Levvia" className="h-10" />
          </div>
        </div>

        <div className="p-5 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-3xl">💧</span>
            <h1 className="text-xl font-heading font-bold text-levvia-fg">
              Dia 2: Hidratação Inteligente
            </h1>
            <p className="text-sm text-levvia-muted font-body">
              Revisão do seu segundo dia de jornada
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🤲 Guia de Drenagem</h2>
            <Day2DrainageGuide onNext={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🍽️ Refeição Sugerida</h2>
            <Day2MealSuggestion profile={profile} onNext={() => {}} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-levvia-fg">🌙 Ritual Noturno</h2>
            <Day2NightRitual onNext={() => {}} />
          </div>

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
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === "welcome") return <><Day2Welcome onNext={() => goTo("drainage")} /><BottomNav /></>;
  if (step === "drainage") return <><Day2DrainageGuide onNext={() => goTo("map")} /><BottomNav /></>;
  if (step === "map") return <><Day2InflammationMap onComplete={handleMapComplete} /><BottomNav /></>;
  if (step === "meal") return <><Day2MealSuggestion profile={profile} onNext={() => goTo("night")} /><BottomNav /></>;
  if (step === "night") return <><Day2NightRitual onNext={() => goTo("closing")} /><BottomNav /></>;
  if (step === "closing") return <><Day2Closing onComplete={handleDay2Complete} /><BottomNav /></>;

  return null;
};

export default Day2Flow;
