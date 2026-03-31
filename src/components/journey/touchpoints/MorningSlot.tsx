import { useState } from "react";
import { ArrowLeft, Calendar, Sunrise, UtensilsCrossed, Droplets, Moon, Activity, GlassWater, type LucideIcon } from "lucide-react";
import type { ChallengeActivity } from "@/hooks/useChallengeData";
import ExerciseDetail from "@/components/ExerciseDetail";
import RecipeDetail from "@/components/RecipeDetail";
import HydrationModule from "./HydrationModule";

interface HydrationSlotProps {
  dailyGoalMl: number;
  subGoalMl: number;
  currentIntakeMl: number;
  dailyPercent: number;
  slotSubGoalMl: number;
  slotLabel: string;
  hydrationText: string;
  onAddWater: (ml: number) => void;
}

interface MorningSlotProps {
  dayNumber: number;
  affirmation: string;
  schedule: { slot: string; time: string; label: string }[];
  exercise: ChallengeActivity | null;
  shotRecipe: ChallengeActivity | null;
  isReviewMode: boolean;
  hydration?: HydrationSlotProps;
  onComplete: (data: { exercise_id?: string; shot_id?: string }) => void;
}

const SLOT_ICONS: Record<string, LucideIcon> = {
  morning: Sunrise,
  lunch: UtensilsCrossed,
  afternoon: Droplets,
  night: Moon,
};

const SlotIcon = ({ slot }: { slot: string }) => {
  const Icon = SLOT_ICONS[slot];
  return Icon ? <Icon size={14} className="text-levvia-muted shrink-0" strokeWidth={1.5} /> : null;
};

const MorningSlot = ({
  dayNumber,
  affirmation,
  schedule,
  exercise,
  shotRecipe,
  isReviewMode,
  hydration,
  onComplete,
}: MorningSlotProps) => {
  const [showExercise, setShowExercise] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [shotDone, setShotDone] = useState(false);

  // Full-screen overlays
  if (showExercise && exercise?.exercise) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
        <ExerciseDetail
          exercise={exercise.exercise as any}
          onBack={() => setShowExercise(false)}
          onMarkDone={() => {
            setExerciseDone(true);
            setShowExercise(false);
          }}
        />
      </div>
    );
  }

  if (showRecipe && shotRecipe?.recipe) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
        <RecipeDetail
          recipe={shotRecipe.recipe as any}
          onBack={() => setShowRecipe(false)}
          onMarkDone={() => {
            setShotDone(true);
            setShowRecipe(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section 1 — Affirmation */}
      <div className="levvia-card p-5 text-center">
        <span className="text-xs uppercase tracking-widest text-levvia-muted font-body">
          Afirmação do Dia
        </span>
        <p className="mt-3 text-sm italic text-levvia-fg font-body leading-relaxed">
          "{affirmation}"
        </p>
      </div>

      {/* Section 2 — Day Schedule */}
      <div className="levvia-card p-5">
        <h3 className="font-semibold text-levvia-fg font-body text-sm mb-4 flex items-center gap-2">
          <Calendar size={14} className="text-levvia-muted" strokeWidth={1.5} />
          Seu Mapa do Dia
        </h3>
        <div className="space-y-0">
          {schedule.map((item, i) => (
            <div
              key={item.slot}
              className={`flex items-center gap-3 py-2 ${
                i < schedule.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-xs text-levvia-muted w-12 font-body">
                {item.time}
              </span>
              <SlotIcon slot={item.slot} />
              <span className="text-sm text-levvia-fg font-body">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — Exercise */}
      {exercise && (
        <div className="levvia-card p-5">
          <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3 flex items-center gap-2">
            <Activity size={14} className="text-levvia-muted" strokeWidth={1.5} />
            Exercício da Manhã
          </h3>
          <p className="font-medium text-levvia-fg font-body text-sm">
            {exercise.label}
          </p>
          {exercise.exercise?.duration && (
            <span className="inline-block mt-1 text-xs bg-muted px-2 py-1 rounded-full text-levvia-muted font-body">
              {exercise.exercise.duration}
            </span>
          )}
          <button
            onClick={() => setShowExercise(true)}
            className="block mt-3 text-sm text-primary underline font-body"
          >
            Ver Exercício Completo →
          </button>
          <label className="flex items-center gap-3 mt-3 cursor-pointer">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                exerciseDone
                  ? "bg-primary border-primary"
                  : "border-border"
              }`}
              onClick={() => setExerciseDone(!exerciseDone)}
            >
              {exerciseDone && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-levvia-fg font-body">Completei o exercício</span>
          </label>
        </div>
      )}

      {/* Section 4 — Morning Shot */}
      {shotRecipe && (
        <div className="levvia-card p-5">
          <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3 flex items-center gap-2">
            <GlassWater size={14} className="text-levvia-muted" strokeWidth={1.5} />
            Shot Matinal
          </h3>
          <p className="font-medium text-levvia-fg font-body text-sm">
            {shotRecipe.label}
          </p>
          {(shotRecipe.recipe as any)?.por_que_resfria && (
            <p className="mt-1 text-sm text-levvia-muted font-body line-clamp-2">
              {(shotRecipe.recipe as any).por_que_resfria}
            </p>
          )}
          <button
            onClick={() => setShowRecipe(true)}
            className="block mt-3 text-sm text-primary underline font-body"
          >
            Ver Receita →
          </button>
        </div>
      )}

      {/* Section 5 — Hydration */}
      {hydration && (
        <HydrationModule
          {...hydration}
          isReviewMode={isReviewMode}
        />
      )}

      {/* Section 6 — Complete Button */}
      {!isReviewMode && (
        <button
          onClick={() =>
            onComplete({
              exercise_id: exercise?.id,
              shot_id: shotRecipe?.id,
            })
          }
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm font-body"
        >
          Concluir Manhã →
        </button>
      )}
    </div>
  );
};

export default MorningSlot;
