import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingSteps, fireResults } from "@/data/onboarding";
import { Heart, ArrowRight, ArrowLeft, Check, Flame, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoFull from "@/assets/logo_livvia_branco.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
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
      if (current.id === 9 || current.id === 10) return true;
      return ((answers[current.id] as string[]) || []).length > 0;
    }
    return true;
  };

  const handleNext = async () => {
    if (current.type === "name") {
      setAnswers({ ...answers, [current.id]: nameInput.trim() });
    }
    if (step < total - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      const finalAnswers = { ...answers, [current.id]: current.type === "name" ? nameInput.trim() : answers[current.id] };
      
      // Save to localStorage (legacy support)
      localStorage.setItem("levvia_onboarding", JSON.stringify(finalAnswers));
      localStorage.setItem("levvia_onboarded", "true");

      // Save to Supabase profile
      if (user?.id) {
        const name = (finalAnswers[2] as string) || "";
        const painLevel = (finalAnswers[3] as string) || "";
        const affectedAreas = (finalAnswers[4] as string[]) || [];
        const objective = (finalAnswers[8] as string) || "";

        await supabase.from("profiles").update({
          name,
          pain_level: painLevel,
          affected_areas: affectedAreas,
          objective,
          onboarding_data: {
            enemies: finalAnswers[6] || [],
            allies: finalAnswers[7] || [],
            restrictions: finalAnswers[9] || [],
            preferences: finalAnswers[10] || [],
            raw: finalAnswers,
          },
        }).eq("id", user.id);
      }

      // Clear cached meal plan so it regenerates with new profile
      localStorage.removeItem("levvia_meal_plan");
      
      navigate("/today");
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

  const painAnswer = answers[3] as string;
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
      const objective = answers[8] as string;
      const personalizedSubtitle = userName && objective
        ? `${userName}, você está pronta! Preparamos um plano de 14 dias focado no seu objetivo: ${objective}. Lembre-se: cada pequeno passo conta. Vamos juntas nessa jornada!`
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

    // Standard question screens
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
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
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
          {step > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <ArrowLeft size={20} strokeWidth={1.5} />
            </motion.button>
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

      {/* Bottom button */}
      <div className="px-6 pb-8">
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
          {step === total - 1 ? "Começar Agora" : "Continuar"}
          <ArrowRight size={18} strokeWidth={1.5} />
        </motion.button>
      </div>
    </div>
  );
};

export default Onboarding;
