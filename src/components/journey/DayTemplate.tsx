import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";
import BottomNav from "@/components/BottomNav";
import DiaryReflection, { type DiaryData } from "./DiaryReflection";
import DayDashboard from "./DayDashboard";

type TemplateSection = "welcome" | "content" | "diary" | "dashboard" | "closing";

interface DayActivity {
  label: string;
  completed: boolean;
}

interface DayTemplateProps {
  dayNumber: number;
  title: string;
  affirmation: string;
  objectives: string[];
  content: React.ReactNode;
  closingMessage?: string;
  nextDayTeaser?: string;
  isReviewMode?: boolean;
  activities?: DayActivity[];
  onComplete?: () => void;
  onDiarySave?: (data: DiaryData) => void;
}

const SECTION_ORDER: TemplateSection[] = [
  "welcome",
  "content",
  "diary",
  "dashboard",
  "closing",
];

const DayTemplate = ({
  dayNumber,
  title,
  affirmation,
  objectives,
  content,
  closingMessage,
  nextDayTeaser,
  isReviewMode = false,
  activities = [],
  onComplete,
  onDiarySave,
}: DayTemplateProps) => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<TemplateSection>("welcome");
  const [diaryDone, setDiaryDone] = useState(false);

  const currentIdx = SECTION_ORDER.indexOf(currentSection);

  const goNext = () => {
    let nextIdx = currentIdx + 1;
    // Skip diary in review mode
    if (isReviewMode && SECTION_ORDER[nextIdx] === "diary") {
      nextIdx++;
    }
    if (nextIdx < SECTION_ORDER.length) {
      setCurrentSection(SECTION_ORDER[nextIdx]);
    }
  };

  const handleDiarySave = (data: DiaryData) => {
    setDiaryDone(true);
    onDiarySave?.(data);
    goNext();
  };

  const handleComplete = () => {
    if (isReviewMode) {
      navigate("/journey");
    } else {
      onComplete?.();
    }
  };

  return (
    <div className="levvia-page min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
        <img src={logoIcon} alt="Levvia" className="h-7" />
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="px-6"
        >
          {/* 1. WELCOME */}
          {currentSection === "welcome" && (
            <div className="py-6 space-y-6">
              <div>
                <p className="text-[11px] font-medium text-levvia-muted uppercase tracking-wider font-body mb-2">
                  Dia {dayNumber}
                </p>
                <h1 className="text-[26px] font-heading font-semibold text-levvia-fg tracking-tight">
                  {title}
                </h1>
              </div>

              <div className="levvia-card p-4">
                <p className="text-[13px] text-levvia-fg font-body italic leading-relaxed text-center">
                  "{affirmation}"
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium text-levvia-muted uppercase tracking-wider font-body mb-3">
                  Objetivos de hoje:
                </p>
                <div className="space-y-2">
                  {objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-levvia-primary text-[13px] mt-0.5">•</span>
                      <span className="text-[13px] text-levvia-fg font-body">
                        {obj}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={goNext}
                className="w-full py-3 rounded-xl bg-levvia-primary text-white font-medium text-[13px] font-body"
              >
                Começar Dia {dayNumber} →
              </button>
            </div>
          )}

          {/* 2. CONTENT */}
          {currentSection === "content" && (
            <div className="py-6 space-y-6">
              {content}
              <button
                onClick={goNext}
                className="w-full py-3 rounded-xl bg-levvia-primary text-white font-medium text-[13px] font-body"
              >
                {isReviewMode ? "Ver Resumo →" : "Continuar →"}
              </button>
            </div>
          )}

          {/* 3. DIARY */}
          {currentSection === "diary" && !isReviewMode && (
            <div className="py-6 space-y-4">
              <h2 className="text-[18px] font-heading font-semibold text-levvia-fg">
                📓 Diário de Leveza
              </h2>
              <DiaryReflection dayNumber={dayNumber} onSave={handleDiarySave} />
            </div>
          )}

          {/* 4. DASHBOARD */}
          {currentSection === "dashboard" && (
            <div className="py-6 space-y-4">
              <h2 className="text-[18px] font-heading font-semibold text-levvia-fg">
                📊 Resumo do Dia
              </h2>
              <DayDashboard dayNumber={dayNumber} activities={activities} />
              <button
                onClick={goNext}
                className="w-full py-3 rounded-xl bg-levvia-primary text-white font-medium text-[13px] font-body"
              >
                Ver Encerramento →
              </button>
            </div>
          )}

          {/* 5. CLOSING */}
          {currentSection === "closing" && (
            <div className="py-6 space-y-6 text-center">
              <span className="text-5xl">🎉</span>
              <h2 className="text-[22px] font-heading font-semibold text-levvia-fg">
                {closingMessage || "Parabéns pela dedicação!"}
              </h2>
              {nextDayTeaser && !isReviewMode && (
                <div className="levvia-card p-4">
                  <p className="text-[12px] text-levvia-muted font-body">
                    🔮 Amanhã:
                  </p>
                  <p className="text-[13px] text-levvia-fg font-body mt-1">
                    {nextDayTeaser}
                  </p>
                </div>
              )}
              <button
                onClick={handleComplete}
                className="w-full py-3 rounded-xl bg-levvia-primary text-white font-medium text-[13px] font-body"
              >
                {isReviewMode ? "Voltar para Jornada" : "Concluir Dia →"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default DayTemplate;
