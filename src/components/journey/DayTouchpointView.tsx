import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { getTouchpointConfig, type TouchpointSlot } from "@/data/touchpointConfig";
import type { TouchpointData } from "@/hooks/useChallengeData";
import type { DayTouchpointProgress } from "@/hooks/useTouchpointProgress";
import MorningSlot from "./touchpoints/MorningSlot";
import LunchSlot from "./touchpoints/LunchSlot";
import AfternoonSlot from "./touchpoints/AfternoonSlot";
import NightSlot from "./touchpoints/NightSlot";
import BottomNav from "@/components/BottomNav";
import logoFull from "@/assets/logo_livvia_azul.png";

export interface HydrationProps {
  dailyGoalMl: number;
  subGoalMl: number;
  currentIntakeMl: number;
  dailyPercent: number;
  addWater: (ml: number) => void;
  slotPercent: (slotIndex: number) => number;
}

interface DayTouchpointViewProps {
  dayNumber: number;
  touchpoints: TouchpointData;
  progress: DayTouchpointProgress;
  isReviewMode?: boolean;
  hydration?: HydrationProps;
  rescueMode?: string;
  onSlotComplete: (slot: TouchpointSlot, data: any) => void;
}

const SLOTS: { slot: TouchpointSlot; label: string; emoji: string; time: string }[] = [
  { slot: "morning", label: "Manhã", emoji: "🌅", time: "08:00" },
  { slot: "lunch", label: "Almoço", emoji: "🥗", time: "12:00" },
  { slot: "afternoon", label: "Tarde", emoji: "💧", time: "15:00" },
  { slot: "night", label: "Noite", emoji: "🌙", time: "21:00" },
];

const SLOT_LABELS: Record<TouchpointSlot, string> = {
  morning: "da manhã",
  lunch: "do almoço",
  afternoon: "da tarde",
  night: "da noite",
};

const SLOT_INDICES: Record<TouchpointSlot, number> = {
  morning: 0,
  lunch: 1,
  afternoon: 2,
  night: 3,
};

const CHECKPOINT_DAYS = [3, 6, 7, 10, 14];

const DayTouchpointView = ({
  dayNumber,
  touchpoints,
  progress,
  isReviewMode = false,
  hydration,
  rescueMode,
  onSlotComplete,
}: DayTouchpointViewProps) => {
  const config = getTouchpointConfig(dayNumber);

  // Compute active slot (first undone)
  const activeSlot = useMemo<TouchpointSlot | null>(() => {
    if (!progress.morning.done) return "morning";
    if (!progress.lunch.done) return "lunch";
    if (!progress.afternoon.done) return "afternoon";
    if (!progress.night.done) return "night";
    return null;
  }, [progress]);

  const completedSlots = useMemo(() => {
    return SLOTS.filter((s) => progress[s.slot].done).length;
  }, [progress]);

  const allDone = completedSlots === 4;

  // Auto-expand logic
  const [expandedSlot, setExpandedSlot] = useState<TouchpointSlot | null>(null);

  useEffect(() => {
    if (isReviewMode) {
      setExpandedSlot(null);
    } else {
      setExpandedSlot(activeSlot);
    }
  }, [activeSlot, isReviewMode]);

  const toggleSlot = (slot: TouchpointSlot) => {
    setExpandedSlot((prev) => (prev === slot ? null : slot));
  };

  return (
    <div className="theme-light levvia-page min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 text-center">
        <img src={logoFull} alt="Levvia" className="h-8 mx-auto mb-4" />
        <p className="text-xs uppercase tracking-wider text-levvia-muted font-body">
          Dia {dayNumber}
        </p>
        <h1 className="text-2xl font-heading font-semibold text-levvia-fg mt-1">
          {config.theme}
        </h1>
        <p className="text-sm text-levvia-muted font-body mt-1">
          {config.purpose}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2">
          {SLOTS.map((s, i) => (
            <div key={s.slot} className="flex items-center gap-2 flex-1 last:flex-none">
              <div
                className={`w-3 h-3 rounded-full shrink-0 ${
                  progress[s.slot].done ? "bg-primary" : "bg-muted"
                }`}
              />
              {i < SLOTS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    progress[s.slot].done ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
          <span className="text-xs text-levvia-muted font-body ml-1">
            {completedSlots}/4
          </span>
        </div>
      </div>

      {/* Touchpoint Cards */}
      <div className="px-6 space-y-3">
        {SLOTS.map((s) => {
          const isDone = progress[s.slot].done;
          const isActive = activeSlot === s.slot;
          const isExpanded = expandedSlot === s.slot;

          return (
            <div key={s.slot} className="levvia-card overflow-hidden transition-all duration-300">
              {/* Card Header */}
              <button
                onClick={() => toggleSlot(s.slot)}
                className="w-full p-4 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    isDone
                      ? "bg-primary/10"
                      : isActive
                      ? "bg-secondary/10"
                      : "bg-muted"
                  }`}
                >
                  {s.emoji}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-levvia-fg font-body text-sm">
                    {s.label}
                  </p>
                  <p className="text-xs text-levvia-muted font-body">{s.time}</p>
                </div>
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check size={14} className="text-primary-foreground" />
                  </div>
                ) : (
                  <ChevronDown
                    size={18}
                    className={`text-levvia-muted transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Card Body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 pb-4">
                      {(() => {
                        const hydrationText = hydration
                          ? (config.hydrationTexts?.[s.slot] || "").replace("{meta}", String(hydration.subGoalMl))
                          : "";
                        const hydrationProps = hydration ? {
                          dailyGoalMl: hydration.dailyGoalMl,
                          subGoalMl: hydration.subGoalMl,
                          currentIntakeMl: hydration.currentIntakeMl,
                          dailyPercent: hydration.dailyPercent,
                          slotSubGoalMl: hydration.subGoalMl,
                          slotLabel: SLOT_LABELS[s.slot],
                          hydrationText,
                          onAddWater: hydration.addWater,
                        } : undefined;

                        return (
                          <>
                            {s.slot === "morning" && (
                              <MorningSlot
                                dayNumber={dayNumber}
                                affirmation={touchpoints.morning.affirmation}
                                schedule={touchpoints.morning.schedule}
                                exercise={touchpoints.morning.exercise}
                                shotRecipe={touchpoints.morning.shotRecipe}
                                isReviewMode={isReviewMode || isDone}
                                hydration={hydrationProps}
                                onComplete={(data) => onSlotComplete("morning", data)}
                              />
                            )}
                            {s.slot === "lunch" && (
                              <LunchSlot
                                dayNumber={dayNumber}
                                recipes={touchpoints.lunch.recipes}
                                tip={touchpoints.lunch.tip}
                                isReviewMode={isReviewMode || isDone}
                                hydration={hydrationProps}
                                onComplete={(data) => onSlotComplete("lunch", data)}
                              />
                            )}
                            {s.slot === "afternoon" && (
                              <AfternoonSlot
                                dayNumber={dayNumber}
                                hydrationText={touchpoints.afternoon.hydrationText}
                                microMovement={touchpoints.afternoon.microMovement}
                                snackRecipe={touchpoints.afternoon.snackRecipe}
                                isReviewMode={isReviewMode || isDone}
                                hydration={hydrationProps}
                                onComplete={(data) => onSlotComplete("afternoon", data)}
                              />
                            )}
                            {s.slot === "night" && (
                              <NightSlot
                                dayNumber={dayNumber}
                                technique={touchpoints.night.technique}
                                closingMessage={touchpoints.night.closingMessage}
                                isReviewMode={isReviewMode || isDone}
                                hydration={hydrationProps}
                                isCheckpointDay={CHECKPOINT_DAYS.includes(dayNumber)}
                                heatMapDay1Data={touchpoints.night.heatMapDay1Data}
                                onComplete={(data) => onSlotComplete("night", data)}
                              />
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Celebration Card */}
      {allDone && (
        <div className="px-6 mt-6">
          <div className="levvia-card p-6 text-center">
            <img src={logoFull} alt="Levvia" className="h-6 mx-auto mb-3 opacity-60" />
            <h2 className="font-heading font-semibold text-xl text-levvia-fg">
              Dia {dayNumber} completo!
            </h2>
            <p className="text-sm text-levvia-muted font-body mt-2">
              Você cuidou de si mesma o dia inteiro. Descanse — você merece.
            </p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default DayTouchpointView;
