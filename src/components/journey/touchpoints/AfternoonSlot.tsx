import { useState } from "react";
import { Droplets, Zap, Leaf } from "lucide-react";
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

interface AfternoonSlotProps {
  dayNumber: number;
  hydrationText: string;
  microMovement: ChallengeActivity | null;
  snackRecipe: ChallengeActivity | null;
  isReviewMode: boolean;
  hydration?: HydrationSlotProps;
  completedSnackId?: string;
  onComplete: (data: { hydration: boolean; micro_challenge_id?: string; snack_id?: string }) => void;
}

const AfternoonSlot = ({
  dayNumber,
  hydrationText,
  microMovement,
  snackRecipe,
  isReviewMode,
  hydration,
  completedSnackId,
  onComplete,
}: AfternoonSlotProps) => {
  const [hydrated, setHydrated] = useState(false);
  const [microDone, setMicroDone] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  // Exercise overlay
  if (showExercise && microMovement?.exercise) {
    return (
      <div className="fixed inset-0 z-[60] bg-background overflow-y-auto">
        <ExerciseDetail
          exercise={microMovement.exercise as any}
          onBack={() => setShowExercise(false)}
          onMarkDone={() => {
            setMicroDone(true);
            setShowExercise(false);
          }}
        />
      </div>
    );
  }

  // Recipe overlay
  if (showRecipe && snackRecipe?.recipe) {
    return (
      <div className="fixed inset-0 z-[60] bg-background overflow-y-auto">
        <RecipeDetail
          recipe={snackRecipe.recipe as any}
          onBack={() => setShowRecipe(false)}
        />
      </div>
    );
  }

  const CheckBox = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-primary border-primary" : "border-border"
        }`}
        onClick={onChange}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-levvia-fg font-body">{label}</span>
    </label>
  );

  return (
    <div className="space-y-5">
      {/* Hydration Module (replaces old checkbox) */}
      {hydration ? (
        <HydrationModule
          {...hydration}
          isReviewMode={isReviewMode}
        />
      ) : (
        <div className="levvia-card p-5">
          <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3 flex items-center gap-2">
            <Droplets size={14} className="text-primary" strokeWidth={1.5} />
            Hidratação
          </h3>
          <p className="text-sm text-levvia-fg font-body leading-relaxed mb-3">
            {hydrationText}
          </p>
          <CheckBox
            checked={hydrated}
            onChange={() => setHydrated(!hydrated)}
            label="Bebi minha água"
          />
        </div>
      )}

      {/* Micro-Movement */}
      {microMovement && (
        <div className="levvia-card p-5">
          <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3 flex items-center gap-2">
            <Zap size={14} className="text-levvia-muted" strokeWidth={1.5} />
            Micro-Movimento (2 min)
          </h3>
          <p className="font-medium text-levvia-fg font-body text-sm">
            {microMovement.label}
          </p>
          {microMovement.exercise?.duration && (
            <span className="inline-block mt-1 text-xs bg-muted px-2 py-1 rounded-full text-levvia-muted font-body">
              {microMovement.exercise.duration}
            </span>
          )}
          <button
            onClick={() => setShowExercise(true)}
            className="block mt-3 text-sm text-primary underline font-body"
          >
            Ver Exercício →
          </button>
          <div className="mt-3">
            <CheckBox
              checked={microDone}
              onChange={() => setMicroDone(!microDone)}
              label="Completei o micro-movimento"
            />
          </div>
        </div>
      )}

      {/* Snack */}
      {snackRecipe && (
        <div className="levvia-card p-5">
          <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3 flex items-center gap-2">
            <Leaf size={14} className="text-levvia-muted" strokeWidth={1.5} />
            Snack Anti-inflamatório
          </h3>
          <p className="font-medium text-levvia-fg font-body text-sm">
            {snackRecipe.label}
          </p>
          {(snackRecipe.recipe as any)?.por_que_resfria && (
            <p className="mt-1 text-sm text-levvia-muted font-body line-clamp-2">
              {(snackRecipe.recipe as any).por_que_resfria}
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

      {/* Complete Button */}
      {!isReviewMode && (
        <>
          <button
            onClick={() =>
              onComplete({
                hydration: hydrated,
                micro_challenge_id: microMovement?.id,
                snack_id: snackRecipe?.id,
              })
            }
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm font-body"
          >
            Concluir Tarde →
          </button>
          <p className="text-xs text-center text-gray-400 mt-2 italic px-4 font-body">
            Conclua todas as etapas para validar seu progresso de hoje e garantir seus resultados em 14 dias. Lembre-se: seu corpo precisa de tempo para processar cada estímulo.
          </p>
        </>
      )}
    </div>
  );
};

export default AfternoonSlot;
