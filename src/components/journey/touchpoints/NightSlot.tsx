import { useState, useEffect } from "react";
import { Map, Wind, Activity, PersonStanding, BookOpen } from "lucide-react";
import logoFull from "@/assets/logo_livvia_azul.png";
import type { NightTechnique } from "@/data/touchpointConfig";
import DiaryReflection, { type DiaryData } from "@/components/journey/DiaryReflection";
import HeatMapInteractive from "@/components/journey/HeatMapInteractive";
import HeatMapComparative from "@/components/journey/HeatMapComparative";
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
  heatMapDay1Data?: Record<string, number> | null;
  onComplete: (data: { technique_done: boolean; journal?: DiaryData }) => void;
}

const NightSlot = ({
  dayNumber,
  technique,
  closingMessage,
  isReviewMode,
  hydration,
  isCheckpointDay = false,
  heatMapDay1Data,
  onComplete,
}: NightSlotProps) => {
  const [techniqueDone, setTechniqueDone] = useState(isReviewMode);
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
  const [showClosing, setShowClosing] = useState(false);

  useEffect(() => {
    if (!showClosing) return;
    const timer = setTimeout(() => {
      onComplete({ technique_done: true, journal: diaryData ?? undefined });
    }, 3000);
    return () => clearTimeout(timer);
  }, [showClosing]);

  // Technique renderer
  const renderTechnique = () => {
    switch (technique.type) {
      case "heatmap":
        if (isReviewMode) {
          return (
            <div className="levvia-card p-5">
              <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3">
                <Map size={14} className="text-levvia-muted inline mr-1.5" strokeWidth={1.5} />{technique.title}
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
                <Map size={14} className="text-levvia-muted inline mr-1.5" strokeWidth={1.5} />{technique.title}
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
              <Wind size={14} className="text-levvia-muted inline mr-1.5" strokeWidth={1.5} />{technique.title}
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

      case "heatmap-comparative":
        return (
          <HeatMapComparative
            day1Data={heatMapDay1Data || null}
            onNext={() => setTechniqueDone(true)}
            isReviewMode={isReviewMode}
          />
        );

      case "text-guide":
      case "legs-elevation":
      case "meditation":
        return (
          <div
            className={`levvia-card p-5 ${
              technique.type === "meditation" ? "bg-primary/5" : ""
            }`}
          >
            <h3 className="font-semibold text-levvia-fg font-body text-sm mb-3 flex items-center gap-2">
              {technique.type === "legs-elevation"
                ? <Activity size={14} className="text-levvia-muted" strokeWidth={1.5} />
                : technique.type === "meditation"
                ? <PersonStanding size={14} className="text-levvia-muted" strokeWidth={1.5} />
                : <BookOpen size={14} className="text-levvia-muted" strokeWidth={1.5} />}
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

      {/* Closing celebration — shown for 3s then fires onComplete */}
      {showClosing && (
        <div className="levvia-card p-6 text-center">
          <img src={logoFull} alt="Levvia" className="h-6 mx-auto mb-4 opacity-60" />
          <p className="text-2xl mb-3">✨</p>
          <h3 className="font-heading font-semibold text-levvia-fg text-base mb-2">
            Jornada de hoje concluída com sucesso!
          </h3>
          <p className="text-sm text-levvia-muted font-body leading-relaxed">
            Agora, permita que seu corpo descanse e processe o alívio. Sua jornada continua amanhã cedo.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Complete Button — after diary saved, hidden in review, hidden during closing */}
      {diaryData && !isReviewMode && !showClosing && (
        <>
          <button
            onClick={() => setShowClosing(true)}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm font-body"
          >
            Concluir Noite →
          </button>
          <p className="text-xs text-center text-gray-400 mt-2 italic px-4 font-body">
            Conclua todas as etapas para validar seu progresso de hoje e garantir seus resultados em 14 dias. Lembre-se: seu corpo precisa de tempo para processar cada estímulo.
          </p>
        </>
      )}
    </div>
  );
};

export default NightSlot;
