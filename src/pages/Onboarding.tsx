import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingSteps } from "@/data/onboarding";
import { Heart, ArrowRight, ArrowLeft, Check } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  const current = onboardingSteps[step];
  const total = onboardingSteps.length;
  const progress = ((step + 1) / total) * 100;

  const handleSingleSelect = (option: string) => {
    setAnswers({ ...answers, [current.id]: option });
  };

  const handleMultiSelect = (option: string) => {
    const prev = (answers[current.id] as string[]) || [];
    const updated = prev.includes(option)
      ? prev.filter((o) => o !== option)
      : [...prev, option];
    setAnswers({ ...answers, [current.id]: updated });
  };

  const canProceed = () => {
    if (current.type === "welcome" || current.type === "info") return true;
    if (current.type === "single") return !!answers[current.id];
    if (current.type === "multi") return ((answers[current.id] as string[]) || []).length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("lipevida_onboarding", JSON.stringify(answers));
      localStorage.setItem("lipevida_onboarded", "true");
      navigate("/today");
    }
  };

  const isSelected = (option: string) => {
    const answer = answers[current.id];
    if (Array.isArray(answer)) return answer.includes(option);
    return answer === option;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <span className="text-xs text-muted-foreground font-semibold ml-auto">
            {step + 1} de {total}
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
            <Heart size={28} className="text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">
          {current.title}
        </h1>
        {current.subtitle && (
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">
            {current.subtitle}
          </p>
        )}

        {/* Options */}
        {current.options && (
          <div className="space-y-3 max-w-sm mx-auto w-full">
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() =>
                  current.type === "multi"
                    ? handleMultiSelect(option)
                    : handleSingleSelect(option)
                }
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected(option)
                    ? "border-primary bg-primary-light"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected(option)
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected(option) && (
                    <Check size={12} className="text-primary-foreground" strokeWidth={3} />
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground">{option}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
            canProceed()
              ? "gradient-primary text-primary-foreground shadow-soft hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {step === total - 1 ? "Começar Agora" : "Continuar"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
