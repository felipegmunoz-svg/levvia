import { useState, useEffect, useRef, useCallback } from "react";
import DayReview from "@/components/journey/DayReview";
import TodaySearchOverlay from "@/components/TodaySearchOverlay";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ShieldAlert, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { debugMount, debugUnmount, isDebugActive } from "@/lib/renderDebug";
import { toast } from "sonner";

import DayTouchpointView from "@/components/journey/DayTouchpointView";
import { useAuth } from "@/hooks/useAuth";
import { useChallengeData } from "@/hooks/useChallengeData";
import { useTouchpointProgress } from "@/hooks/useTouchpointProgress";
import { useHydration } from "@/hooks/useHydration";
import { useRescueMode } from "@/hooks/useRescueMode";
import type { TouchpointSlot } from "@/data/touchpointConfig";

const Today = () => {
  const renderCount = useRef(0);
  renderCount.current++;
  const [searchParams] = useSearchParams();
  const reviewDay = searchParams.get("review") ? Number(searchParams.get("review")) : null;

  const navTo = useNavigate();

  useEffect(() => {
    debugMount("Today");
    return () => debugUnmount("Today");
  }, []);

  const [showSearch, setShowSearch] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { rescueMode, evaluateCheckpoint } = useRescueMode();

  const {
    profile,
    currentDay,
    todayData,
    todayTouchpoints,
    nextDayTouchpoints,
    loading,
    setTestDay,
  } = useChallengeData(rescueMode);

  const [replayDay, setReplayDay] = useState<number | null>(null);

  const handleResetLocal = () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('levvia_'))
      .forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  // Safety timeout: force loading off if useChallengeData never resolves
  const [forceReady, setForceReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("⚠️ Safety timeout 8s atingido, forçando renderização");
        setForceReady(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [loading]);

  // Touchpoint progress for the active day (or replay day)
  const effectiveDay = replayDay ?? currentDay;
  const { progress, activeSlot, isDayComplete, completedSlots, markSlotDone, resetSlot, loading: tpLoading } = useTouchpointProgress(effectiveDay);
  const hydration = useHydration(profile?.weightKg ?? null, effectiveDay);

  const handleSlotComplete = useCallback(async (slot: TouchpointSlot, data: any) => {
    await markSlotDone(slot, data);
    if (slot === 'night') {
      const score = data?.journal?.lightnessScore;
      if (score != null) {
        evaluateCheckpoint(effectiveDay, score);
      }
      // Celebration confetti
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#00C49A', '#38BDF8', '#FFFFFF'] 
      });

      if (effectiveDay === 14) {
        toast("VOCÊ CONSEGUIU! 14 dias de vitória. 🌊");
        setTimeout(() => {
          navTo('/celebration');
        }, 2000);
      } else {
        toast("Dia concluído com sucesso! Descanse — você merece.");
      }
    }
  }, [markSlotDone, evaluateCheckpoint, effectiveDay, navTo]);

  // Review mode: standalone component
  if (reviewDay) {
    return <DayReview />;
  }

  // --- Compute content to show ---
  let content: React.ReactNode = null;

  // Loading state
  if ((loading && !forceReady) || tpLoading || authLoading) {
    content = (
      <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00C49A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#E0E0E0]">Preparando sua jornada de alívio...</p>
        </div>
      </div>
    );
  }

  // Preview mode: show next day read-only
  else if (isDayComplete && showPreview && nextDayTouchpoints && effectiveDay < 14) {
    const emptyProgress = { morning: { done: false }, lunch: { done: false }, afternoon: { done: false }, night: { done: false } } as any;
    content = (
      <>
        <div className="px-4 pt-3">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-1.5 text-sm text-[#00C49A] font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao meu dia
          </button>
        </div>
        <DayTouchpointView
          dayNumber={effectiveDay + 1}
          touchpoints={nextDayTouchpoints}
          progress={emptyProgress}
          readOnly={true}
          onSlotComplete={() => {}}
        />
      </>
    );
  }

  // Main path: new 4-touchpoint architecture
  else if (todayTouchpoints) {
    // Get previous day's heat map for persistence
    let prevHeatMap: Record<string, number> | null = null;
    if (effectiveDay >= 2) {
      try {
        const prevDayData = localStorage.getItem(`levvia_tp_day_${effectiveDay - 1}`);
        if (prevDayData) {
          const parsed = JSON.parse(prevDayData);
          prevHeatMap = parsed?.night?.night_heat_map || null;
        }
      } catch { /* ignore parse errors */ }
    }

    content = (
      <DayTouchpointView
        dayNumber={effectiveDay}
        touchpoints={todayTouchpoints}
        progress={progress || { morning: { done: false }, lunch: { done: false }, afternoon: { done: false }, night: { done: false } }}
        hydration={hydration}
        rescueMode={rescueMode}
        onSlotComplete={handleSlotComplete}
        onResetSlot={resetSlot}
        heatMapDay1={
          profile?.heatMapDay1 && typeof profile.heatMapDay1 === 'object' &&
          Object.values(profile.heatMapDay1 as Record<string, unknown>).some(v => typeof v === 'number' && v > 0)
            ? (profile.heatMapDay1 as Record<string, number>)
            : null
        }
        previousHeatMap={prevHeatMap}
        onPreviewNext={() => setShowPreview(true)}
      />
    );
  }

  // Fallback loading
  else {
    content = (
      <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00C49A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#E0E0E0]">Sincronizando seu progresso...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 px-3 py-2 flex flex-wrap gap-2 items-center text-xs sticky top-0 z-50 border-b border-purple-700/50">
        <span className="font-bold text-purple-300">🧪 Teste de Dias:</span>
        {[1, 2, 3, 4, 5, 6, 7, 14].map(d => (
          <button 
            key={d} 
            onClick={() => {
              setTestDay(d);
              setReplayDay(d);
            }} 
            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors font-semibold text-[11px]"
          >
            Dia {d}
          </button>
        ))}
        <button 
          onClick={() => {
            setTestDay(null);
            setReplayDay(null);
          }} 
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors font-semibold text-[11px]"
        >
          Hoje
        </button>
        <button onClick={handleResetLocal} className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded transition-colors ml-auto font-semibold text-[11px]">
          Resetar Tudo
        </button>
      </div>
      {showSearch && <TodaySearchOverlay onClose={() => setShowSearch(false)} />}
      <div className="levvia-page bg-[#0A1128]">
        {/* Quick access bar */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <button
            onClick={() => setShowSearch(true)}
            className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#E0E0E0] text-sm hover:border-[#00C49A]/30 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Buscar no Guia...</span>
          </button>
          <button
            onClick={() => navTo("/practices?tab=sos")}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            SOS
          </button>
        </div>
        {content}
      </div>
    </>
  );
};

export default Today;
