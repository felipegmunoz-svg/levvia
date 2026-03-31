import { useState } from "react";
import { Utensils } from "lucide-react";
import type { ChallengeActivity } from "@/hooks/useChallengeData";
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

interface LunchSlotProps {
  dayNumber: number;
  recipes: ChallengeActivity[];
  tip: string;
  isReviewMode: boolean;
  hydration?: HydrationSlotProps;
  onComplete: (data: { recipe_choice_id?: string }) => void;
}

const LunchSlot = ({
  dayNumber,
  recipes,
  tip,
  isReviewMode,
  hydration,
  onComplete,
}: LunchSlotProps) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [showRecipeIdx, setShowRecipeIdx] = useState<number | null>(null);

  // Full-screen recipe overlay
  if (showRecipeIdx !== null && recipes[showRecipeIdx]?.recipe) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
        <RecipeDetail
          recipe={recipes[showRecipeIdx].recipe as any}
          onBack={() => setShowRecipeIdx(null)}
          onMarkDone={() => {
            setSelectedRecipeId(recipes[showRecipeIdx].id);
            setShowRecipeIdx(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-levvia-fg font-body text-sm flex items-center gap-2">
          <Utensils size={14} className="text-levvia-muted" strokeWidth={1.5} />
          Sua Refeição Anti-inflamatória
        </h3>
        <p className="text-sm text-levvia-muted font-body mt-1">
          Escolha a receita que mais combina com você hoje.
        </p>
      </div>

      {/* Recipe Cards */}
      <div className="space-y-3">
        {recipes.map((recipe, i) => {
          const isSelected = selectedRecipeId === recipe.id;
          return (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipeId(recipe.id)}
              className={`levvia-card p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-primary border-2 ring-1 ring-primary/20"
                  : "border-border"
              }`}
            >
              <p className="font-medium text-levvia-fg font-body text-sm">
                {recipe.label}
              </p>
              {(recipe.recipe as any)?.por_que_resfria && (
                <p className="mt-1 text-xs text-levvia-muted font-body line-clamp-2">
                  {(recipe.recipe as any).por_que_resfria}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {(recipe.recipe as any)?.time && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-levvia-muted font-body">
                    {(recipe.recipe as any).time}
                  </span>
                )}
                {(recipe.recipe as any)?.servings && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-levvia-muted font-body">
                    {(recipe.recipe as any).servings}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRecipeIdx(i);
                }}
                className="block mt-2 text-sm text-primary underline font-body"
              >
                Ver Receita Completa →
              </button>
            </div>
          );
        })}
      </div>

      {/* Dica Lavínia */}
      {tip && (
        <div className="levvia-card p-4 bg-primary/5 border-primary/10">
          <span className="text-xs uppercase tracking-widest text-primary font-medium font-body">
            💡 Dica Lavínia
          </span>
          <p className="mt-2 text-sm text-levvia-fg italic font-body leading-relaxed">
            {tip}
          </p>
        </div>
      )}

      {/* Hydration */}
      {hydration && (
        <HydrationModule
          {...hydration}
          isReviewMode={isReviewMode}
        />
      )}

      {/* Complete Button */}
      {!isReviewMode && (
        <>
          <button
            onClick={() => onComplete({ recipe_choice_id: selectedRecipeId || undefined })}
            disabled={!selectedRecipeId}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm font-body disabled:opacity-40 transition-opacity"
          >
            Concluir Almoço →
          </button>
          <p className="text-xs text-center text-gray-400 mt-2 italic px-4 font-body">
            Conclua todas as etapas para validar seu progresso de hoje e garantir seus resultados em 14 dias. Lembre-se: seu corpo precisa de tempo para processar cada estímulo.
          </p>
        </>
      )}
    </div>
  );
};

export default LunchSlot;
