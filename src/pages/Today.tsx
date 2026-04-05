import { useState, useEffect, useRef, useCallback } from "react";
import DayReview from "@/components/journey/DayReview";
import TodaySearchOverlay from "@/components/TodaySearchOverlay";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ShieldAlert } from "lucide-react";
import { debugRender, debugMount, debugUnmount, isDebugActive, getDebugCounters } from "@/lib/renderDebug";
import { toast } from "sonner";

import DayTouchpointView from "@/components/journey/DayTouchpointView";
import Day1Flow from "@/components/journey/Day1Flow";
import Day2Flow from "@/components/journey/Day2Flow";
import Day3Flow from "@/components/journey/Day3Flow";
import Day4Flow from "@/components/journey/Day4Flow";
import Day5Flow from "@/components/journey/Day5Flow";
import Day6Flow from "@/components/journey/Day6Flow";
import PaywallModal from "@/components/journey/PaywallModal";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
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
  const { user, loading: authLoading } = useAuth();
  const { rescueMode, evaluateCheckpoint, isCheckpointDay } = useRescueMode();

  const {
    profile,
    currentDay,
    todayData,
    todayTouchpoints,
    dayTitle,
    dayObjective,
    loading,
  } = useChallengeData(rescueMode);

  const { hasPremium, loading: premiumLoading } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);

  const DEBUG_EMAILS = ['felipegmunoz@gmail.com', 'teste_levvia_dia3_2026@gmail.com'];
  const isAuthorized = !!user?.email && DEBUG_EMAILS.includes(user.email.toLowerCase());
  const isDev = (import.meta.env.MODE === 'development' || localStorage.getItem('levvia_debug') === 'true') && isAuthorized;

  const [replayDay, setReplayDay] = useState<number | null>(null);

  const handleResetLocal = () => {
    ['levvia_day1_progress', 'levvia_day2_progress', 'levvia_day3_progress', 'levvia_day4_progress', 'levvia_day5_progress', 'levvia_challenge_progress',
     'levvia_tp_day_1', 'levvia_tp_day_2', 'levvia_tp_day_3', 'levvia_tp_day_4', 'levvia_tp_day_5', 'levvia_tp_day_6',
    ].forEach(k => localStorage.removeItem(k));
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
  // rescueMode already initialized above (line 37)

  const handleSlotComplete = useCallback(async (slot: TouchpointSlot, data: any) => {
    await markSlotDone(slot, data);
    if (slot === 'night') {
      const score = data?.journal?.lightnessScore;
      if (score != null) {
        evaluateCheckpoint(effectiveDay, score);
      }
      if (effectiveDay === 14) {
        toast("Parabéns! Você completou os 14 dias. 🌊");
        setTimeout(() => {
          navTo('/celebration');
        }, 2000);
      } else {
        toast("Sua jornada continua amanhã. Descanse — você merece.");
      }
    }
  }, [markSlotDone, evaluateCheckpoint, effectiveDay]);

  // Debug render instrumentation
  const branch = (loading && !forceReady) || premiumLoading
    ? "LOADING"
    : replayDay ? `REPLAY_DAY_${replayDay}`
    : `TOUCHPOINT_DAY_${currentDay}`;

  debugRender("Today", {
    renderNum: renderCount.current, branch, currentDay, authLoading, loading, premiumLoading,
    hasPremium, completedSlots, activeSlot,
    hasTodayData: !!todayData, forceReady,
  });

  // Review mode: standalone component, no dependency on Day flows
  if (reviewDay) {
    return <DayReview />;
  }

  // --- Compute content to show ---
  let content: React.ReactNode = null;

  // Debug replay using old DayXFlow (for legacy testing)
  if (replayDay === 1) content = <Day1Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 2) content = <Day2Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 3) content = <Day3Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 4) content = <Day4Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 5) content = <Day5Flow onComplete={() => setReplayDay(null)} />;
  else if (replayDay === 6) content = <Day6Flow onComplete={() => setReplayDay(null)} />;

  // Loading state
  else if ((loading && !forceReady) || tpLoading || premiumLoading) {
    content = (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Personalizando seu plano...</p>
        </div>
      </div>
    );
  }

  // Mid-journey fallback: if user started a day in the old sequential flow, let them finish it
  else if (localStorage.getItem(`levvia_day${currentDay}_progress`)) {
    if (currentDay === 1) content = <Day1Flow onComplete={() => { localStorage.removeItem('levvia_day1_progress'); window.location.reload(); }} />;
    else if (currentDay === 2) content = <Day2Flow onComplete={() => { localStorage.removeItem('levvia_day2_progress'); window.location.reload(); }} />;
    else if (currentDay === 3) content = <Day3Flow onComplete={() => { localStorage.removeItem('levvia_day3_progress'); window.location.reload(); }} />;
    else if (currentDay === 4) content = <Day4Flow onComplete={() => { localStorage.removeItem('levvia_day4_progress'); window.location.reload(); }} />;
    else if (currentDay === 5) content = <Day5Flow onComplete={() => { localStorage.removeItem('levvia_day5_progress'); window.location.reload(); }} />;
    else if (currentDay === 6) content = <Day6Flow onComplete={() => { localStorage.removeItem('levvia_day6_progress'); window.location.reload(); }} />;
  }

  // Paywall gate for day 4+
  else if (currentDay > 3 && !hasPremium) {
    content = <PaywallModal onClose={() => setShowPaywall(false)} />;
  }

  // Main path: new 4-touchpoint architecture
  else if (todayTouchpoints) {
    content = (
      <DayTouchpointView
        dayNumber={currentDay}
        touchpoints={todayTouchpoints}
        progress={progress}
        hydration={hydration}
        rescueMode={rescueMode}
        onSlotComplete={handleSlotComplete}
        onResetSlot={resetSlot}
        heatMapDay1={(profile?.heatMapDay1 as Record<string, number>) ?? null}
      />
    );
  }

  // Fallback loading if touchpoints data not ready yet
  else {
    content = (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Preparando seu dia...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isDev && (
        <div className="bg-yellow-100 px-3 py-2 flex flex-wrap gap-2 items-center text-xs sticky top-0 z-50">
          <span className="font-semibold text-yellow-800">🐛 Debug:</span>
          {[1, 2, 3, 4, 5, 6].map(d => (
            <button key={d} onClick={() => setReplayDay(d)} className="px-2 py-1 bg-yellow-300 text-yellow-900 rounded hover:bg-yellow-400 transition-colors">
              Dia {d}
            </button>
          ))}
          <button onClick={handleResetLocal} className="px-2 py-1 bg-red-300 text-red-900 rounded hover:bg-red-400 transition-colors ml-auto">
            Resetar Local
          </button>
        </div>
      )}
      {isDebugActive() && (
        <div style={{ position: 'fixed', bottom: 70, right: 8, zIndex: 9999, background: 'rgba(0,0,0,0.85)', color: '#0f0', padding: '8px 12px', borderRadius: 8, fontSize: 10, fontFamily: 'monospace', maxWidth: 260, pointerEvents: 'none' }}>
          <div>🔄 Today #{renderCount.current} | branch: {branch}</div>
          <div>day: {currentDay} | slots: {completedSlots}/4 | active: {activeSlot}</div>
          <div>premium:{String(hasPremium)} pLoad:{String(premiumLoading)} cLoad:{String(loading)} auth:{String(authLoading)}</div>
          <div>tp:{todayTouchpoints ? 'yes' : 'no'} | replay:{String(replayDay)}</div>
        </div>
      )}
      {showSearch && <TodaySearchOverlay onClose={() => setShowSearch(false)} />}
      <div className="theme-light levvia-page">
        {/* Quick access bar */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <button
            onClick={() => setShowSearch(true)}
            className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-muted-foreground text-sm hover:border-secondary/30 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Buscar no Guia...</span>
          </button>
          <button
            onClick={() => navTo("/practices?tab=exercises&sos=1")}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sos/10 border border-sos/20 text-sos text-sm font-medium hover:bg-sos/20 transition-all"
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
