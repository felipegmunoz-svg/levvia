import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingSteps, fireResults } from "@/data/onboarding";
import { Heart, ArrowRight, ArrowLeft, Check, Flame, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoFull from "@/assets/logo_livvia_branco.png";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null);

  const current = onboardingSteps[step];
  const total = onboardingSteps.length;
  const progress = ((step + 1) / total) * 100;

  const handleSingleSelect = (option: string) => {
    const updated = { ...answers, [current.id]: option };
    setAnswers(updated);
    setSelectedSingle(option);
    setTimeout(() => {
      if (step < total - 1) {
        setDirection(1);
        setStep((s) => s + 1);
        setSelectedSingle(null);
      }
    }, 400);
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
    if (current.type === "number") {
      const val = parseInt(numberInput);
      const cfg = current.numberConfig;
      return !isNaN(val) && (!cfg?.min || val >= cfg.min) && (!cfg?.max || val <= cfg.max);
    }
    if (current.type === "body_metrics") {
      const w = parseFloat(weightInput);
      const h = parseFloat(heightInput);
      return !isNaN(w) && w > 20 && w < 400 && !isNaN(h) && h > 50 && h < 300;
    }
    if (current.type === "result" || current.type === "info") return true;
    if (current.type === "single") return !!answers[current.id];
    if (current.type === "multi") {
      // Optional multi-select steps
      if (current.id === 7 || current.id === 14 || current.id === 15) return true;
      return ((answers[current.id] as string[]) || []).length > 0;
    }
    return true;
  };

  const handleNext = async () => {
    // Save current step's input
    if (current.type === "name") {
      setAnswers((a) => ({ ...a, [current.id]: nameInput.trim() }));
    }
    if (current.type === "number") {
      setAnswers((a) => ({ ...a, [current.id]: numberInput.trim() }));
    }
    if (current.type === "body_metrics") {
      setAnswers((a) => ({ ...a, [current.id]: [weightInput.trim(), heightInput.trim()] }));
    }

    if (step < total - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      // Final save
      const finalAnswers = { ...answers };
      if (current.type === "name") finalAnswers[current.id] = nameInput.trim();
      if (current.type === "number") finalAnswers[current.id] = numberInput.trim();
      if (current.type === "body_metrics") finalAnswers[current.id] = [weightInput.trim(), heightInput.trim()];

      // Save to localStorage only — Supabase sync happens after auth
      localStorage.setItem("levvia_onboarding", JSON.stringify(finalAnswers));
      localStorage.setItem("levvia_onboarded", "true");

      // Clear cached meal plan so it regenerates with new profile
      localStorage.removeItem("levvia_meal_plan");

      navigate("/diagnosis");
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const isSelected = (option: string) => {
    const answer = answers[current.id];
    if (Array.isArray(answer)) return answer.includes(option);
    return answer === option;
  };

  const painAnswer = answers[8] as string;
  const fireResult = painAnswer ? fireResults[painAnswer] : null;

  const userName = (answers[2] as string) || nameInput.trim();

  const renderContent = () => {
    if (current.type === "welcome") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <img src={logoFull} alt="Levvia" className="w-[200px] h-auto" />
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed"
          >
            Seu caminho para a leveza.
          </motion.p>
        </div>
      );
    }

    if (current.type === "disclaimer") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
              <ShieldCheck size={28} strokeWidth={1.5} className="text-accent" />
            </div>
          </div>
          <h1 className="text-2xl font-light text-foreground text-center mb-2">{current.title}</h1>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">{current.subtitle}</p>
          <div className="max-w-sm mx-auto w-full">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setDisclaimerChecked(!disclaimerChecked)}
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-2xl border transition-all duration-200 text-left ${
                disclaimerChecked ? "border-secondary bg-secondary/10" : "border-white/10 bg-white/[0.06]"
              }`}
            >
              <motion.div
                animate={disclaimerChecked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  disclaimerChecked ? "border-secondary bg-secondary" : "border-muted-foreground/30"
                }`}
              >
                {disclaimerChecked && <Check size={14} className="text-foreground" strokeWidth={3} />}
              </motion.div>
              <span className="text-sm font-medium text-foreground">
                Li e entendi que este app não é um tratamento médico
              </span>
            </motion.button>
          </div>
        </div>
      );
    }

    if (current.type === "name") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Heart size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-light text-foreground text-center mb-2">{current.title}</h1>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">{current.subtitle}</p>
          <div className="max-w-sm mx-auto w-full">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Seu nome ou apelido"
              className="w-full px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.06] text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none transition-colors backdrop-blur-[10px]"
              autoFocus
            />
          </div>
        </div>
      );
    }

    if (current.type === "number") {
      const cfg = current.numberConfig;
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Heart size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-light text-foreground text-center mb-2">{current.title}</h1>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">{current.subtitle}</p>
          <div className="max-w-sm mx-auto w-full flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder={cfg?.placeholder || ""}
              min={cfg?.min}
              max={cfg?.max}
              className="flex-1 px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.06] text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none transition-colors backdrop-blur-[10px] text-center"
              autoFocus
            />
            {cfg?.unit && (
              <span className="text-sm text-muted-foreground font-medium">{cfg.unit}</span>
            )}
          </div>
        </div>
      );
    }

    if (current.type === "body_metrics") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Heart size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-light text-foreground text-center mb-2">{current.title}</h1>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">{current.subtitle}</p>
          <div className="max-w-sm mx-auto w-full space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground w-16">Peso</label>
              <input
                type="number"
                inputMode="decimal"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="Ex: 68"
                className="flex-1 px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.06] text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none transition-colors backdrop-blur-[10px] text-center"
                autoFocus
              />
              <span className="text-sm text-muted-foreground font-medium w-8">kg</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground w-16">Altura</label>
              <input
                type="number"
                inputMode="decimal"
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                placeholder="Ex: 165"
                className="flex-1 px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.06] text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none transition-colors backdrop-blur-[10px] text-center"
              />
              <span className="text-sm text-muted-foreground font-medium w-8">cm</span>
            </div>
          </div>
        </div>
      );
    }

    if (current.type === "result") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white/[0.06] border border-white/10">
              <Flame size={36} strokeWidth={1.5} className={fireResult?.colorClass || "text-secondary"} />
            </div>
          </motion.div>
          <h1 className="text-2xl font-light text-foreground text-center mb-1">Seu Fogo Interno</h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-lg font-medium text-center mb-4 ${fireResult?.colorClass || "text-secondary"}`}
          >
            {fireResult?.level || "Brisa Leve"}
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="max-w-sm mx-auto rounded-2xl p-5 glass-card"
          >
            <p className="text-sm text-foreground leading-relaxed text-center">{fireResult?.description || ""}</p>
          </motion.div>
          <p className="text-xs text-muted-foreground text-center mt-4 max-w-xs mx-auto">
            Com base nas suas respostas, preparamos práticas personalizadas para o seu nível.
          </p>
        </div>
      );
    }

    if (current.type === "info") {
      const objective = answers[13] as string;
      const personalizedSubtitle = userName && objective
        ? `${userName}, reunimos todas as suas informações! Vamos ver seu diagnóstico personalizado e descobrir o melhor caminho para o seu objetivo: ${objective}.`
        : current.subtitle;

      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Heart size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-light text-foreground text-center mb-2">{current.title}</h1>
          <motion.p
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed"
          >
            {personalizedSubtitle}
          </motion.p>
        </div>
      );
    }

    // Standard question screens (single / multi)
    return (
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <Heart size={28} strokeWidth={1.5} className="text-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-light text-foreground text-center mb-2">{current.title}</h1>
        {current.subtitle && (
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed">{current.subtitle}</p>
        )}
        {current.options && (
          <div className="space-y-3 max-w-sm mx-auto w-full">
            {current.options.map((option, i) => (
              <motion.button
                key={option}
                initial={{ x: 30, opacity: 0 }}
                animate={
                  selectedSingle === option && current.type === "single"
                    ? { x: 0, opacity: 1, scale: [1, 1.04, 1], boxShadow: ["0 0 0px hsl(var(--secondary)/0)", "0 0 20px hsl(var(--secondary)/0.4)", "0 0 0px hsl(var(--secondary)/0)"] }
                    : { x: 0, opacity: 1, scale: 1 }
                }
                transition={
                  selectedSingle === option && current.type === "single"
                    ? { duration: 0.35, ease: "easeOut" }
                    : { delay: i * 0.06, duration: 0.25 }
                }
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  current.type === "multi" ? handleMultiSelect(option) : handleSingleSelect(option)
                }
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 text-left ${
                  isSelected(option)
                    ? "border-secondary bg-secondary/10"
                    : "border-white/10 bg-white/[0.06] hover:border-secondary/30"
                }`}
              >
                <motion.div
                  animate={isSelected(option) ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.2 }}
                  className={`flex-shrink-0 w-5 h-5 ${current.type === "multi" ? "rounded-md" : "rounded-full"} border-2 flex items-center justify-center transition-all ${
                    isSelected(option) ? "border-secondary bg-secondary" : "border-muted-foreground/30"
                  }`}
                >
                  {isSelected(option) && <Check size={12} className="text-foreground" strokeWidth={3} />}
                </motion.div>
                <span className="text-sm font-medium text-foreground">{option}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background gradient-page flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          {step > 0 ? (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              <span className="text-xs font-medium">Voltar</span>
            </motion.button>
          ) : (
            <div />
          )}
          <span className="text-xs text-muted-foreground font-medium ml-auto">
            {step + 1} de {total}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-secondary to-success rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Animated step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 flex flex-col"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom buttons */}
      <div className="px-6 pb-8">
        {current.type === "single" && step > 0 ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-3 rounded-3xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Voltar
          </motion.button>
        ) : current.type !== "single" ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className={`w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-4 rounded-3xl font-medium text-base transition-all duration-200 ${
              canProceed()
                ? "gradient-primary text-foreground hover:opacity-90"
                : "bg-white/[0.06] text-muted-foreground cursor-not-allowed"
            }`}
          >
            {step === total - 1 ? "Ver Meu Diagnóstico" : "Continuar"}
            <ArrowRight size={18} strokeWidth={1.5} />
          </motion.button>
        ) : null}
      </div>
    </div>
  );
};

export default Onboarding;
