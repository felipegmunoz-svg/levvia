import { useState } from "react";
import { ArrowLeft, Activity, GlassWater, CheckSquare } from "lucide-react";
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
  exercise: ChallengeActivity | null;
  shotRecipe: ChallengeActivity | null;
  isReviewMode: boolean;
  hydration?: HydrationSlotProps;
  completedShotId?: string;
  initialExerciseDone?: boolean;
  initialShotDone?: boolean;
  onComplete: (data: { exercise_id?: string; shot_id?: string }) => void;
}

const MorningSlot = ({
  dayNumber,
  affirmation,
  exercise,
  shotRecipe,
  isReviewMode,
  hydration,
  completedShotId,
  initialExerciseDone,
  initialShotDone,
  onComplete,
}: MorningSlotProps) => {
  const [showExercise, setShowExercise] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [exerciseDone, setExerciseDone] = useState(initialExerciseDone ?? false);
  const [shotDone, setShotDone] = useState(initialShotDone ?? false);

  // Full-screen overlays
  if (showExercise && exercise?.exercise) {
    return (
      <div className="fixed inset-0 z-[60] bg-background overflow-y-auto">
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
    const isShotCompleted = completedShotId === shotRecipe.id;
    return (
      <div className="fixed inset-0 z-[60] bg-background overflow-y-auto">
        <RecipeDetail
          recipe={shotRecipe.recipe as any}
          onBack={() => setShowRecipe(false)}
          isCompleted={isShotCompleted}
          onMarkDone={isShotCompleted ? undefined : () => {
            setShotDone(true);
            setShowRecipe(false);
            onComplete({ exercise_id: exercise?.id, shot_id: shotRecipe.id });
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

      {/* Section 2 — Exercise */}
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
          {!isReviewMode && (
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
          )}
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
          {!isReviewMode && (
            <label className="flex items-center gap-3 mt-3 cursor-pointer">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  shotDone ? "bg-primary border-primary" : "border-border"
                }`}
                onClick={() => setShotDone(!shotDone)}
              >
                {shotDone && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-levvia-fg font-body">Marcar como Tomado</span>
            </label>
          )}
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
      {!isReviewMode && (() => {
        const canComplete = (!exercise || exerciseDone) && (!shotRecipe || shotDone);
        return (
          <>
            {!canComplete && (
              <p className="text-xs italic text-center text-levvia-muted font-body px-2">
                Para desbloquear o próximo período e garantir seus resultados em 14 dias, certifique-se de concluir todas as etapas acima.
              </p>
            )}
            <button
              onClick={() => onComplete({ exercise_id: exercise?.id, shot_id: shotRecipe?.id })}
              disabled={!canComplete}
              className={`w-full py-3 rounded-xl font-medium text-sm font-body transition-all ${
                canComplete
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-levvia-muted cursor-not-allowed"
              }`}
            >
              Concluir Manhã →
            </button>
            {canComplete && (
              <p className="text-xs text-center text-gray-400 mt-2 italic px-4 font-body">
                Conclua todas as etapas para validar seu progresso de hoje e garantir seus resultados em 14 dias. Lembre-se: seu corpo precisa de tempo para processar cada estímulo.
              </p>
            )}
          </>
        );
      })()}
    </div>
  );
};

export default MorningSlot;
