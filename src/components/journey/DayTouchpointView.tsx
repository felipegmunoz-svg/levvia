import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FlowSilhouette from "@/components/FlowSilhouette";
import DayLockedScreen from "@/components/journey/DayLockedScreen";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Sunrise, UtensilsCrossed, Droplets, Moon, Calendar, type LucideIcon } from "lucide-react";
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
  onResetSlot?: (slot: TouchpointSlot) => void;
  heatMapDay1?: Record<string, number> | null;
}

const SLOTS: { slot: TouchpointSlot; label: string; Icon: LucideIcon; time: string }[] = [
  { slot: "morning", label: "Manhã", Icon: Sunrise, time: "08:00" },
  { slot: "lunch", label: "Almoço", Icon: UtensilsCrossed, time: "12:00" },
  { slot: "afternoon", label: "Tarde", Icon: Droplets, time: "15:00" },
  { slot: "night", label: "Noite", Icon: Moon, time: "21:00" },
];

const SLOT_LABELS: Record<TouchpointSlot, string> = {
  morning: "esta manhã",
  lunch: "este almoço",
  afternoon: "esta tarde",
  night: "esta noite",
};

const SLOT_INDICES: Record<TouchpointSlot, number> = {
  morning: 0,
  lunch: 1,
  afternoon: 2,
  night: 3,
};

const CHECKPOINT_DAYS = [3, 6, 7, 10, 14];

// Engagement micro-descriptions per day per slot
const SLOT_DESCRIPTIONS: Partial<Record<number, Record<TouchpointSlot, string>>> = {
  1: {
    morning: "Ative sua bomba linfática e prepare seu shot anti-inflamatório base.",
    lunch: "Nutrição consciente: Bowl de coco ou Crepioca? Escolha seu fluxo.",
    afternoon: "Momento crítico do inchaço: micro-movimento e hidratação estratégica.",
    night: "Restauração profunda: mapeie seu fogo interno e limpe o sistema.",
  },
};

const SLOT_ORDER: TouchpointSlot[] = ["morning", "lunch", "afternoon", "night"];

const canExpandSlot = (slot: TouchpointSlot, progress: DayTouchpointProgress): boolean => {
  const idx = SLOT_ORDER.indexOf(slot);
  if (idx === 0) return true;
  return SLOT_ORDER.slice(0, idx).every((s) => progress[s]?.done === true);
};

const DayTouchpointView = ({
  dayNumber,
  touchpoints,
  progress,
  isReviewMode = false,
  hydration,
  rescueMode,
  onSlotComplete,
  onResetSlot,
  heatMapDay1,
}: DayTouchpointViewProps) => {
  const navigate = useNavigate();
  const config = getTouchpointConfig(dayNumber);

  // Hydration warning state
  const [hydrationWarning, setHydrationWarning] = useState<{
    slot: TouchpointSlot;
    data: any;
    percent: number;
  } | null>(null);

  // Intercept slot completion to check hydration before confirming
  const handleSlotComplete = useCallback(
    (slot: TouchpointSlot, data: any) => {
      if (isReviewMode) { onSlotComplete(slot, data); return; }
      const slotIdx = SLOT_INDICES[slot];
      const pct = hydration?.slotPercent(slotIdx) ?? 1;
      if (pct < 0.8) {
        setHydrationWarning({ slot, data, percent: pct });
      } else {
        onSlotComplete(slot, data);
      }
    },
    [hydration, isReviewMode, onSlotComplete]
  );

  // Compute active slot (first undone)
  const activeSlot = useMemo<TouchpointSlot | null>(() => {
    if (!progress?.morning?.done) return "morning";
    if (!progress?.lunch?.done) return "lunch";
    if (!progress?.afternoon?.done) return "afternoon";
    if (!progress?.night?.done) return "night";
    return null;
  }, [progress]);

  const completedSlots = useMemo(() => {
    return SLOTS.filter((s) => progress?.[s.slot]?.done === true).length;
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

      {heatMapDay1 && Object.keys(heatMapDay1).length > 0 && (
        <div className="px-6 pb-2">
          <button
            onClick={() => navigate("/progress")}
            className="w-full levvia-card p-4 flex items-center gap-4 text-left active:opacity-80 transition-opacity"
          >
            <div className="w-[70px] h-[200px] overflow-hidden shrink-0 flex justify-center items-start">
              <FlowSilhouette heatMapData={heatMapDay1} waterIntakeMl={hydration?.currentIntakeMl ?? 0} waterGoalMl={hydration?.dailyGoalMl ?? 2000} size="small" animated={false} />
            </div>
            <div>
              <p className="text-sm font-heading font-semibold text-levvia-fg">Seu Fogo Interno</p>
              <p className="text-xs text-levvia-muted font-body mt-0.5">
                {completedSlots === 0
                  ? "Seu estado inicial registrado →"
                  : "Toque para ver sua evolução →"}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Jornada de Alívio hoje — schedule external to MorningSlot */}
      {touchpoints.morning.schedule.length > 0 && (
        <div className="px-6 pb-2">
          <div className="levvia-card p-4">
            <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3 flex items-center gap-2">
              <Calendar size={14} className="text-levvia-muted" strokeWidth={1.5} />
              Sua Jornada de Alívio hoje
            </h3>
            <div className="space-y-0">
              {touchpoints.morning.schedule.map((item, i) => {
                const slotDef = SLOTS.find((s) => s.slot === item.slot);
                const Icon = slotDef?.Icon;
                return (
                  <div
                    key={item.slot}
                    className={`flex items-center gap-3 py-2 ${
                      i < touchpoints.morning.schedule.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="text-xs text-levvia-muted w-12 font-body shrink-0">
                      {item.time}
                    </span>
                    {Icon && <Icon size={14} className="text-levvia-muted shrink-0" strokeWidth={1.5} />}
                    <span className="text-sm text-levvia-fg font-body">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2">
          {SLOTS.map((s, i) => (
            <div key={s.slot} className="flex items-center gap-2 flex-1 last:flex-none">
              <div
                className={`w-3 h-3 rounded-full shrink-0 ${
                  progress?.[s.slot]?.done ? "bg-primary" : "bg-muted"
                }`}
              />
              {i < SLOTS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    progress?.[s.slot]?.done ? "bg-primary" : "bg-muted"
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
          const slotProgress = progress?.[s.slot] as any;
          const isDone = slotProgress?.done === true;
          const isActive = activeSlot === s.slot;
          const isExpanded = expandedSlot === s.slot;

          // Find completed recipe/item label
          const completedItemId = slotProgress?.recipe_choice_id || slotProgress?.snack_id || slotProgress?.shot_id;
          let completedItemLabel: string | null = null;
          if (isDone && completedItemId) {
            const allActivities = [
              ...(touchpoints.morning?.shotRecipe ? [touchpoints.morning.shotRecipe] : []),
              ...(touchpoints.lunch?.recipes || []),
              ...(touchpoints.afternoon?.snackRecipe ? [touchpoints.afternoon.snackRecipe] : []),
            ];
            const found = allActivities.find((a) => a.id === completedItemId);
            if (found) completedItemLabel = found.label;
          }

          return (
            <div key={s.slot} className="levvia-card overflow-hidden transition-all duration-300">
              {/* Card Header */}
              <button
                onClick={() => toggleSlot(s.slot)}
                className="w-full p-4 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDone
                      ? "bg-primary/10"
                      : isActive
                      ? "bg-secondary/10"
                      : "bg-muted"
                  }`}
                >
                  <s.Icon
                    size={18}
                    className={isDone ? "text-primary" : isActive ? "text-secondary" : "text-levvia-muted"}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-levvia-fg font-body text-sm">
                    {s.label}
                  </p>
                  <p className="text-xs text-levvia-muted font-body">{s.time}</p>
                  {isDone && (
                    <p className="text-[11px] text-primary font-body mt-0.5 flex items-center gap-1">
                      <Check size={10} />
                      {s.slot === "morning" && "Exercício + shot concluídos"}
                      {s.slot === "lunch" && (completedItemLabel || "Almoço concluído")}
                      {s.slot === "afternoon" && (completedItemLabel || "Lanche concluído")}
                      {s.slot === "night" && "Rotina noturna concluída"}
                    </p>
                  )}
                  {SLOT_DESCRIPTIONS[dayNumber]?.[s.slot] && !isDone && (
                    <p className="text-[11px] text-gray-400 font-body mt-0.5 leading-snug pr-2">
                      {SLOT_DESCRIPTIONS[dayNumber]![s.slot]}
                    </p>
                  )}
                </div>
                {isDone ? (
                  <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                    <Check size={12} strokeWidth={2} className="text-primary" />
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
                                exercise={touchpoints.morning.exercise}
                                shotRecipe={touchpoints.morning.shotRecipe}
                                isReviewMode={isReviewMode || isDone}
                                hydration={hydrationProps}
                                completedShotId={(progress?.morning as any)?.shot_id}
                                initialExerciseDone={isDone || !!(progress?.morning as any)?.exercise_id}
                                initialShotDone={isDone || !!(progress?.morning as any)?.shot_id}
                                onComplete={(data) => handleSlotComplete("morning", data)}
                              />
                            )}
                            {s.slot === "lunch" && (
                              <LunchSlot
                                dayNumber={dayNumber}
                                recipes={touchpoints.lunch.recipes}
                                tip={touchpoints.lunch.tip}
                                isReviewMode={isReviewMode || isDone}
                                hydration={hydrationProps}
                                completedRecipeId={(progress?.lunch as any)?.recipe_choice_id}
                                onComplete={(data) => handleSlotComplete("lunch", data)}
                                onReset={() => onResetSlot?.("lunch")}
                              />
                            )}
                            {s.slot === "afternoon" && (
                              <AfternoonSlot
                                dayNumber={dayNumber}
                                hydrationText={hydration ? (touchpoints.afternoon.hydrationText || "").replace("{meta}", String(hydration.subGoalMl)) : (touchpoints.afternoon.hydrationText || "")}
                                microMovement={touchpoints.afternoon.microMovement}
                                snackRecipe={touchpoints.afternoon.snackRecipe}
                                isReviewMode={isReviewMode || isDone}
                                hydration={hydrationProps}
                                completedSnackId={(progress?.afternoon as any)?.snack_id}
                                initialMicroDone={isDone || !!(progress?.afternoon as any)?.micro_challenge_id}
                                onComplete={(data) => handleSlotComplete("afternoon", data)}
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
                                onComplete={(data) => handleSlotComplete("night", data)}
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

      {/* Hydration warning modal */}
      {hydrationWarning && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 pb-20">
          <div className="w-full max-w-md bg-levvia-surface rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={18} className="text-primary" strokeWidth={1.5} />
              <h3 className="font-heading font-semibold text-levvia-fg text-base">
                Hidratação abaixo da meta
              </h3>
            </div>
            <p className="text-sm text-levvia-muted font-body leading-relaxed mb-5">
              Sua linfa precisa de água para fluir e desinflamar. Você atingiu{" "}
              <span className="font-semibold text-levvia-fg">
                {Math.round(hydrationWarning.percent * 100)}%
              </span>{" "}
              da meta deste período. Que tal beber mais um copo agora para ajudar seu corpo ou compensar no próximo bloco?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onSlotComplete(hydrationWarning.slot, hydrationWarning.data);
                  setHydrationWarning(null);
                }}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm font-body"
              >
                Continuar mesmo assim
              </button>
              <button
                onClick={() => setHydrationWarning(null)}
                className="w-full py-3 rounded-xl bg-muted text-levvia-muted font-medium text-sm font-body"
              >
                Beber mais água primeiro
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default DayTouchpointView;
