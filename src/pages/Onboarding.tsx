import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingSteps, fireResults } from "@/data/onboarding";
import { Heart, ArrowRight, ArrowLeft, Check, Flame, ShieldCheck } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [nameInput, setNameInput] = useState("");

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
    if (current.type === "welcome") return true;
    if (current.type === "disclaimer") return disclaimerChecked;
    if (current.type === "name") return nameInput.trim().length >= 2;
    if (current.type === "result" || current.type === "info") return true;
    if (current.type === "single") return !!answers[current.id];
    if (current.type === "multi") {
      // Restrições (id 9) e Preferências (id 10) são opcionais
      if (current.id === 9 || current.id === 10) return true;
      return ((answers[current.id] as string[]) || []).length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (current.type === "name") {
      setAnswers({ ...answers, [current.id]: nameInput.trim() });
    }
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("lipevida_onboarding", JSON.stringify({ ...answers, [current.id]: current.type === "name" ? nameInput.trim() : answers[current.id] }));
      localStorage.setItem("lipevida_onboarded", "true");
      navigate("/today");
    }
  };

  const isSelected = (option: string) => {
    const answer = answers[current.id];
    if (Array.isArray(answer)) return answer.includes(option);
    return answer === option;
  };

  // Get fire result based on pain answer (step 3)
  const painAnswer = answers[3] as string;
  const fireResult = painAnswer ? fireResults[painAnswer] : null;

  // Get user name and objective for final screen
  const userName = (answers[2] as string) || nameInput.trim();
  const userObjective = answers[8] as string;
  const userRestrictions = (answers[9] as string[]) || [];
  const userPreferences = (answers[10] as string[]) || [];

  const renderContent = () => {
    // Disclaimer screen
    if (current.type === "disclaimer") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center shadow-soft">
              <ShieldCheck size={28} className="text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">
            {current.title}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">
            {current.subtitle}
          </p>
          <div className="max-w-sm mx-auto w-full">
            <button
              onClick={() => setDisclaimerChecked(!disclaimerChecked)}
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 text-left shadow-sm ${
                disclaimerChecked
                  ? "border-primary bg-primary-light"
                  : "border-primary/40 bg-card"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  disclaimerChecked
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {disclaimerChecked && (
                  <Check size={14} className="text-primary-foreground" strokeWidth={3} />
                )}
              </div>
              <span className="text-sm font-semibold text-foreground">
                Li e entendi que este app não é um tratamento médico
              </span>
            </button>
          </div>
        </div>
      );
    }

    // Name input screen
    if (current.type === "name") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
              <Heart size={28} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">
            {current.title}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">
            {current.subtitle}
          </p>
          <div className="max-w-sm mx-auto w-full">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Seu nome ou apelido"
              className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-card text-foreground text-sm font-semibold placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>
      );
    }

    // Fire result screen
    if (current.type === "result") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-soft ${fireResult?.bgClass || "bg-primary-light"}`}>
              <Flame size={36} className={fireResult?.colorClass || "text-primary"} />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground text-center mb-1">
            Seu Fogo Interno
          </h1>
          <p className={`text-lg font-extrabold text-center mb-4 ${fireResult?.colorClass || "text-primary"}`}>
            {fireResult?.level || "Brisa Leve"}
          </p>
          <div className={`max-w-sm mx-auto rounded-2xl p-5 ${fireResult?.bgClass || "bg-primary-light"}`}>
            <p className="text-sm text-foreground leading-relaxed text-center">
              {fireResult?.description || ""}
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4 max-w-xs mx-auto">
            Com base nas suas respostas, preparamos práticas personalizadas para o seu nível.
          </p>
        </div>
      );
    }

    // Final personalized screen
    if (current.type === "info") {
      const objective = answers[8] as string;
      const personalizedSubtitle = userName && objective
        ? `${userName}, você está pronta! Preparamos um plano de 14 dias focado no seu objetivo: ${objective}. Lembre-se: cada pequeno passo conta. Vamos juntas nessa jornada!`
        : current.subtitle;

      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
              <Heart size={28} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">
            {current.title}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">
            {personalizedSubtitle}
          </p>
        </div>
      );
    }

    // Standard question screens (single/multi/welcome)
    return (
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
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
                  className={`flex-shrink-0 w-5 h-5 ${current.type === "multi" ? "rounded-md" : "rounded-full"} border-2 flex items-center justify-center transition-all ${
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
    );
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

      {renderContent()}

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
