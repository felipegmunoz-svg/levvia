import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets } from "lucide-react";

interface HydrationModuleProps {
  dailyGoalMl: number;
  subGoalMl: number;
  currentIntakeMl: number;
  dailyPercent: number;
  slotSubGoalMl: number;
  slotLabel: string;
  hydrationText: string;
  onAddWater: (ml: number) => void;
  isReviewMode: boolean;
}

const TICK_LABELS = ["M", "A", "T", "N"];

const HydrationModule = ({
  dailyGoalMl,
  subGoalMl,
  currentIntakeMl,
  dailyPercent,
  slotSubGoalMl,
  slotLabel,
  hydrationText,
  onAddWater,
  isReviewMode,
}: HydrationModuleProps) => {
  const [showCheck, setShowCheck] = useState<number | null>(null);
  const goalReached = dailyPercent >= 1.0;

  const handleAdd = (ml: number) => {
    onAddWater(ml);
    setShowCheck(ml);
    setTimeout(() => setShowCheck(null), 800);
  };

  return (
    <div className="levvia-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-levvia-fg font-body text-sm flex items-center gap-1.5">
          <Droplets size={14} className="text-primary" strokeWidth={1.5} />
          Hidratação
        </h3>
        <span className="text-xs bg-muted px-2 py-1 rounded-full text-levvia-muted font-body">
          {currentIntakeMl}ml / {dailyGoalMl}ml
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="relative h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.round(dailyPercent * 100)}%` }}
          />
        </div>
        {/* Tick marks */}
        <div className="relative h-4 mt-1">
          {TICK_LABELS.map((label, i) => (
            <div
              key={label}
              className="absolute flex flex-col items-center"
              style={{ left: `${(i + 1) * 25}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-px h-1.5 bg-border" />
              <span className="text-[8px] text-levvia-muted font-body">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Text + Sub-goal */}
      <div>
        <p className="text-sm text-levvia-fg italic font-body leading-relaxed">
          {hydrationText}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-levvia-muted font-body">
            Sua meta para {slotLabel}: <span className="font-semibold text-primary">{slotSubGoalMl}ml</span>
          </p>
        </div>
      </div>

      {/* Tap Buttons or Goal Reached */}
      {!isReviewMode && (
        <>
          {goalReached ? (
            <div className="bg-primary/5 rounded-xl p-4 text-center">
              <p className="text-sm text-primary font-medium font-body">
                Meta atingida! Seu corpo agradece cada gota. 💙
              </p>
            </div>
          ) : (
            <div className="flex gap-3 relative">
              <button
                onClick={() => handleAdd(250)}
                className="flex-1 levvia-card p-3 text-center cursor-pointer hover:border-primary transition-all active:scale-95"
              >
                <Droplets size={18} className="mx-auto text-primary mb-1" />
                <span className="text-sm font-medium text-levvia-fg font-body">+250ml</span>
              </button>
              <button
                onClick={() => handleAdd(500)}
                className="flex-1 levvia-card p-3 text-center cursor-pointer hover:border-primary transition-all active:scale-95"
              >
                <Droplets size={22} className="mx-auto text-primary mb-1" />
                <span className="text-sm font-medium text-levvia-fg font-body">+500ml</span>
              </button>

              {/* Check animation */}
              <AnimatePresence>
                {showCheck !== null && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13L9 17L19 7" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HydrationModule;
