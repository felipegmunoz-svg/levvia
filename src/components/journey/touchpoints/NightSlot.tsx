import { useState } from "react";
import type { NightTechnique } from "@/data/touchpointConfig";
import DiaryReflection, { type DiaryData } from "@/components/journey/DiaryReflection";
import HeatMapInteractive from "@/components/journey/HeatMapInteractive";
import BreathingCircle from "@/components/journey/BreathingCircle";
import FoodTrafficLight from "@/components/journey/FoodTrafficLight";
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

interface NightSlotProps {
  dayNumber: number;
  technique: NightTechnique;
  closingMessage: string;
  isReviewMode: boolean;
  hydration?: HydrationSlotProps;
  isCheckpointDay?: boolean;
  onComplete: (data: { technique_done: boolean; journal?: DiaryData }) => void;
}

const NightSlot = ({
  dayNumber,
  technique,
  closingMessage,
  isReviewMode,
  hydration,
  isCheckpointDay = false,
  onComplete,
}: NightSlotProps) => {
  const [techniqueDone, setTechniqueDone] = useState(isReviewMode);
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);

  // Technique renderer
  const renderTechnique = () => {
    switch (technique.type) {
      case "heatmap":
        if (isReviewMode) {
          return (
            <div className="levvia-card p-5">
              <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3">
                🗺️ {technique.title}
              </h3>
              <HeatMapInteractive onNext={() => {}} />
              <p className="mt-2 text-xs text-levvia-muted font-body">
                Mapa registrado ✅
              </p>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <div className="levvia-card p-5 overflow-visible">
              <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3">
                🗺️ {technique.title}
              </h3>
              {technique.description && (
                <p className="text-sm text-levvia-muted font-body mb-4">
                  {technique.description}
                </p>
              )}
            </div>
            <div className="min-h-[480px]">
              <HeatMapInteractive onNext={() => setTechniqueDone(true)} />
            </div>
          </div>
        );

      case "breathing":
        if (isReviewMode) {
          return (
            <div className="levvia-card p-5 flex items-center gap-3">
              <span className="text-primary">✅</span>
              <span className="text-sm text-levvia-fg font-body">
                Respiração 4-7-8 concluída
              </span>
            </div>
          );
        }
        return (
          <div className="levvia-card p-5">
            <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3">
              🫁 {technique.title}
            </h3>
            <BreathingCircle onContinue={() => setTechniqueDone(true)} />
          </div>
        );

      case "food-traffic-light":
        if (isReviewMode) {
          return (
            <div className="levvia-card p-5 flex items-center gap-3">
              <span className="text-primary">✅</span>
              <span className="text-sm text-levvia-fg font-body">
                Semáforo Alimentar revisado
              </span>
            </div>
          );
        }
        return <FoodTrafficLight onContinue={() => setTechniqueDone(true)} />;

      case "text-guide":
      case "legs-elevation":
      case "meditation":
        return (
          <div
            className={`levvia-card p-5 ${
              technique.type === "meditation" ? "bg-primary/5" : ""
            }`}
          >
            <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3">
              {technique.type === "legs-elevation" ? "🦵" : technique.type === "meditation" ? "🧘" : "📖"}{" "}
              {technique.title}
            </h3>
            {technique.description && (
              <p className="text-sm text-levvia-muted font-body leading-relaxed mb-4">
                {technique.description}
              </p>
            )}
            {technique.steps && technique.steps.length > 0 && (
              <div className="space-y-3 mb-4">
                {technique.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-primary font-medium">{i + 1}</span>
                    </div>
                    <p className="text-sm text-levvia-fg font-body leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            )}
            {technique.duration && (
              <span className="inline-block text-xs bg-muted px-2 py-1 rounded-full text-levvia-muted font-body mb-4">
                {technique.duration}
              </span>
            )}
            {technique.type === "legs-elevation" && (
              <p className="text-sm text-levvia-muted italic font-body mb-4">
                Mantenha por 10 minutos
              </p>
            )}
            {!isReviewMode && !techniqueDone && (
              <button
                onClick={() => setTechniqueDone(true)}
                className="w-full py-3 rounded-xl bg-primary/10 text-primary font-medium text-sm font-body"
              >
                Concluí a técnica ✓
              </button>
            )}
            {techniqueDone && (
              <p className="text-xs text-levvia-muted font-body">✅ Técnica concluída</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Hydration */}
      {hydration && (
        <HydrationModule
          {...hydration}
          isReviewMode={isReviewMode}
        />
      )}

      {/* Technique */}
      {renderTechnique()}

      {/* Diary — only after technique done and not review */}
      {techniqueDone && !isReviewMode && !diaryData && (
        <div className="levvia-card p-5">
          <h3 className="font-semibold text-levvia-fg font-body text-sm mb-4">
            📓 Diário de Leveza
          </h3>
          <DiaryReflection
            dayNumber={dayNumber}
            onSave={(data) => setDiaryData(data)}
          />
        </div>
      )}

      {/* Checkpoint feedback — after diary saved */}
      {diaryData && isCheckpointDay && diaryData.lightnessScore != null && (
        <div className={`levvia-card p-5 ${diaryData.lightnessScore < 5 ? "bg-primary/5" : "bg-primary/5"}`}>
          <p className="text-sm text-levvia-fg italic font-body text-center">
            {diaryData.lightnessScore < 5
              ? "Entendemos que o caminho está difícil. Vamos adaptar sua jornada para trazer mais alívio nos próximos dias. Estamos juntas. 💙"
              : diaryData.lightnessScore >= 7
              ? "Que alegria ver seu progresso! Vamos continuar fortalecendo essa leveza. 🌊"
              : null}
          </p>
        </div>
      )}

      {/* Closing Message — after diary saved or review mode */}
      {(diaryData || isReviewMode) && (
        <div className="levvia-card p-5 text-center">
          <p className="font-heading font-semibold text-lg text-levvia-fg">
            {closingMessage}
          </p>
        </div>
      )}

      {/* Complete Button — after diary saved, hidden in review */}
      {diaryData && !isReviewMode && (
        <button
          onClick={() =>
            onComplete({
              technique_done: true,
              journal: diaryData,
            })
          }
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm font-body"
        >
          Concluir Noite →
        </button>
      )}
    </div>
  );
};

export default NightSlot;
