import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingSteps, fireResults, getFilteredPantryCategories } from "@/data/onboarding";
import { Heart, ArrowRight, ArrowLeft, Check, Flame, ShieldCheck, ShoppingBag } from "lucide-react";
import InstallPWAPrompt from "@/components/InstallPWAPrompt";
import HeatMapInteractive from "@/components/journey/HeatMapInteractive";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
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

const fireConfettiColors: Record<string, string[]> = {
  "Sem dor": ["#2dd4a8", "#34d399", "#6ee7b7"],
  "Dor leve": ["#f0c456", "#fbbf24", "#fcd34d"],
  "Dor moderada": ["#fb923c", "#f97316", "#fdba74"],
  "Dor intensa": ["#f87171", "#ef4444", "#fca5a5"],
  "Dor muito intensa": ["#f87171", "#ef4444", "#fca5a5"],
};

const ResultScreen = ({ fireResult, painAnswer }: { fireResult: import("@/data/onboarding").FireResult | null; painAnswer: string }) => {
  useEffect(() => {
    const colors = fireConfettiColors[painAnswer] || ["#2dd4a8", "#34d399"];
    
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        gravity: 0.8,
        scalar: 0.9,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        gravity: 0.8,
        scalar: 0.9,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [fireResult]);

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
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>(() => {
    const saved = localStorage.getItem("levvia_onboarding");
    console.log("📂 [MOUNT] localStorage levvia_onboarding:", saved ? `EXISTE (${saved.length} chars)` : "NULL");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("📂 [MOUNT] Restaurado:", Object.keys(parsed).length, "respostas, keys:", Object.keys(parsed));
        return parsed;
      } catch (e) { console.error("📂 [MOUNT] Parse error:", e); }
    }
    return {};
  });
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [nameInput, setNameInput] = useState(() => {
    const saved = localStorage.getItem("levvia_onboarding");
    if (saved) { try { const v = (JSON.parse(saved)[2] as string) || ""; console.log("📂 [MOUNT] nameInput:", v); return v; } catch {} }
    return "";
  });
  const [numberInput, setNumberInput] = useState(() => {
    const saved = localStorage.getItem("levvia_onboarding");
    if (saved) { try { const v = (JSON.parse(saved)[3] as string) || ""; console.log("📂 [MOUNT] numberInput:", v); return v; } catch {} }
    return "";
  });
  const [weightInput, setWeightInput] = useState(() => {
    const saved = localStorage.getItem("levvia_onboarding");
    if (saved) { try { const m = JSON.parse(saved)[5]; const v = Array.isArray(m) ? m[0] || "" : ""; console.log("📂 [MOUNT] weightInput:", v); return v; } catch {} }
    return "";
  });
  const [heightInput, setHeightInput] = useState(() => {
    const saved = localStorage.getItem("levvia_onboarding");
    if (saved) { try { const m = JSON.parse(saved)[5]; const v = Array.isArray(m) ? m[1] || "" : ""; console.log("📂 [MOUNT] heightInput:", v); return v; } catch {} }
    return "";
  });
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null);
  const [customPantryInput, setCustomPantryInput] = useState("");

  // Persist answers to localStorage on every change
  useEffect(() => {
    console.log("🔍 [useEffect] answers mudou:", {
      length: Object.keys(answers).length,
      keys: Object.keys(answers),
    });
    if (Object.keys(answers).length > 0) {
      localStorage.setItem("levvia_onboarding", JSON.stringify(answers));
      const verify = localStorage.getItem("levvia_onboarding");
      console.log("💾 [useEffect] Persistido:", Object.keys(answers).length, "respostas. Verificação:", verify ? `${verify.length} chars` : "FALHOU");
    } else {
      console.warn("⚠️ [useEffect] answers está vazio, não persistiu");
    }
  }, [answers]);

  const current = onboardingSteps[step];
  const total = onboardingSteps.length;
  const progress = ((step + 1) / total) * 100;

  const handleSingleSelect = (option: string) => {
    console.log(`🔍 [handleSingleSelect] step=${step}, id=${current.id}, value="${option}"`);
    setAnswers((prev) => {
      const updated = { ...prev, [current.id]: option };
      console.log(`✅ [handleSingleSelect] answers: ${Object.keys(prev).length} → ${Object.keys(updated).length}, keys:`, Object.keys(updated));
      return updated;
    });
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
    const isDeselecting = prev.includes(option);
    if (!isDeselecting && current.id === 16 && prev.length >= 3) return;
    const updated = isDeselecting
      ? prev.filter((o) => o !== option)
      : [...prev, option];
    console.log(`🔍 [handleMultiSelect] step=${step}, id=${current.id}, option="${option}", selected: ${prev.length} → ${updated.length}`);
    setAnswers((a) => {
      const result = { ...a, [current.id]: updated };
      console.log(`✅ [handleMultiSelect] answers keys: ${Object.keys(a).length} → ${Object.keys(result).length}`, Object.keys(result));
      return result;
    });

    if (current.id === 13) localStorage.setItem("levvia_restrictions", JSON.stringify(updated));
    if (current.id === 16) localStorage.setItem("levvia_objectives", JSON.stringify(updated));
  };

  const canProceed = () => {
    if (current.type === "welcome") return true;
    if (current.type === "install_pwa") return true;
    if (current.type === "heat_map") return true; // has its own CTA
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
    if (current.type === "pantry") return true; // optional
    if (current.type === "single") return !!answers[current.id];
    if (current.type === "multi") {
      // Optional multi-select steps
      if (current.id === 7 || current.id === 13 || current.id === 14) return true;
      return ((answers[current.id] as string[]) || []).length > 0;
    }
    return true;
  };

  const handleNext = async () => {
    console.log(`🔍 [handleNext] step=${step}, id=${current.id}, type="${current.type}"`);
    // Save current step's input
    if (current.type === "name") {
      console.log(`🔍 [handleNext] name: "${nameInput.trim()}"`);
      setAnswers((a) => {
        const r = { ...a, [current.id]: nameInput.trim() };
        console.log(`✅ [handleNext/name] answers keys:`, Object.keys(r));
        return r;
      });
    }
    if (current.type === "number") {
      console.log(`🔍 [handleNext] number: "${numberInput.trim()}"`);
      setAnswers((a) => {
        const r = { ...a, [current.id]: numberInput.trim() };
        console.log(`✅ [handleNext/number] answers keys:`, Object.keys(r));
        return r;
      });
    }
    if (current.type === "body_metrics") {
      console.log(`🔍 [handleNext] body_metrics: w="${weightInput.trim()}", h="${heightInput.trim()}"`);
      setAnswers((a) => {
        const r = { ...a, [current.id]: [weightInput.trim(), heightInput.trim()] };
        console.log(`✅ [handleNext/body_metrics] answers keys:`, Object.keys(r));
        return r;
      });
    }

    // Pantry: merge checkboxes + free text
    if (current.type === "pantry") {
      const checkboxItems = ((answers[current.id] as string[]) || []).map(i => i.toLowerCase());
      const customItems = customPantryInput
        .split(',')
        .map(i => i.trim().toLowerCase())
        .filter(i => i.length > 0);
      const combined = Array.from(new Set([...checkboxItems, ...customItems]));
      console.log('🔍 handleNext pantry — checkboxItems:', checkboxItems);
      console.log('🔍 handleNext pantry — customItems:', customItems);
      console.log('🔍 handleNext pantry — combined:', combined);
      setAnswers((a) => ({ ...a, [current.id]: combined }));
      // Safety net: persist immediately to avoid React state race conditions
      localStorage.setItem("levvia_pantry_items", JSON.stringify(combined));
    }

    // Backup restrictions (step 13) — same safety net pattern as pantry
    if (current.type === "multi" && current.id === 13) {
      const items = (answers[current.id] as string[]) || [];
      localStorage.setItem("levvia_restrictions", JSON.stringify(items));
      console.log('🔒 Backup restrictions:', items);
    }

    // Backup objectives (step 16) — same safety net pattern as pantry
    if (current.type === "multi" && current.id === 16) {
      const items = (answers[current.id] as string[]) || [];
      localStorage.setItem("levvia_objectives", JSON.stringify(items));
      console.log('🎯 Backup objectives:', items);
    }

    if (step < total - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      // Final save
      console.log("🔍 [Complete] Estado ANTES de save final:", {
        answersLength: Object.keys(answers).length,
        answersKeys: Object.keys(answers),
        localStorage: localStorage.getItem("levvia_onboarding") ? `${localStorage.getItem("levvia_onboarding")!.length} chars` : "NULL",
      });

      if (Object.keys(answers).length === 0) {
        console.error("❌ [Complete] ERRO CRÍTICO: answers está vazio! Dados do onboarding serão perdidos.");
      }

      const finalAnswers = { ...answers };
      if (current.type === "name") finalAnswers[current.id] = nameInput.trim();
      if (current.type === "number") finalAnswers[current.id] = numberInput.trim();
      if (current.type === "body_metrics") finalAnswers[current.id] = [weightInput.trim(), heightInput.trim()];

      // Pantry fallback
      if (!finalAnswers[15] || (Array.isArray(finalAnswers[15]) && (finalAnswers[15] as string[]).length === 0)) {
        const pantryBackup = localStorage.getItem("levvia_pantry_items");
        if (pantryBackup) {
          try { finalAnswers[15] = JSON.parse(pantryBackup); console.log('🛒 Usando backup pantry no save final:', finalAnswers[15]); } catch { /* ignore */ }
        }
      }

      // Restrictions fallback
      if (!finalAnswers[13] || (Array.isArray(finalAnswers[13]) && (finalAnswers[13] as string[]).length === 0)) {
        const restrictionsBackup = localStorage.getItem("levvia_restrictions");
        if (restrictionsBackup) {
          try { finalAnswers[13] = JSON.parse(restrictionsBackup); console.log('🔒 Usando backup restrictions no save final:', finalAnswers[13]); } catch { /* ignore */ }
        }
      }

      // Objectives fallback
      if (!finalAnswers[16] || (Array.isArray(finalAnswers[16]) && (finalAnswers[16] as string[]).length === 0)) {
        const objectivesBackup = localStorage.getItem("levvia_objectives");
        if (objectivesBackup) {
          try { finalAnswers[16] = JSON.parse(objectivesBackup); console.log('🎯 Usando backup objectives no save final:', finalAnswers[16]); } catch { /* ignore */ }
        }
      }

      console.log('🔍 [Complete] finalAnswers completo:', JSON.stringify(finalAnswers));
      console.log('🔍 [Complete] Campos críticos:', {
        name: finalAnswers[2],
        age: finalAnswers[3],
        pantry: Array.isArray(finalAnswers[15]) ? (finalAnswers[15] as string[]).length + ' items' : finalAnswers[15],
        objectives: finalAnswers[16],
        restrictions: finalAnswers[13],
      });

      localStorage.setItem("levvia_onboarding", JSON.stringify(finalAnswers));
      localStorage.setItem("levvia_onboarded", "true");

      // Verify final save
      const finalVerify = localStorage.getItem("levvia_onboarding");
      console.log("✅ [Complete] Verificação final localStorage:", finalVerify ? `${finalVerify.length} chars` : "FALHOU!");

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

  // Filtered pantry categories based on restrictions (step 13)
  const filteredPantry = useMemo(() => {
    const restrictions = (answers[13] as string[]) || [];
    return getFilteredPantryCategories(restrictions);
  }, [answers[13]]);

  const allFilteredPantryItems = useMemo(() => {
    return filteredPantry.flatMap((c) => c.items);
  }, [filteredPantry]);

  const handleSelectMostPantry = () => {
    const count = Math.ceil(allFilteredPantryItems.length * 0.75);
    const selected = allFilteredPantryItems.slice(0, count);
    console.log(`🔍 [handleSelectMostPantry] id=${current.id}, selecting ${selected.length} of ${allFilteredPantryItems.length} items`);
    setAnswers((a) => {
      const r = { ...a, [current.id]: selected };
      console.log(`✅ [handleSelectMostPantry] answers keys:`, Object.keys(r));
      return r;
    });
    localStorage.setItem("levvia_pantry_items", JSON.stringify(selected));
  };

  // Auto-skip install_pwa step on desktop/standalone/dismissed (useEffect, not render)
  useEffect(() => {
    const currentStep = onboardingSteps[step];
    if (currentStep?.type !== "install_pwa") return;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    const dismissed = localStorage.getItem("levvia_install_dismissed") === "true";

    if (!isMobile || isStandalone || dismissed) {
      console.log("⏭️ Auto-skip install_pwa step");
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const renderContent = () => {
    if (current.type === "install_pwa") {
      return (
        <InstallPWAPrompt
          onDismiss={() => {
            localStorage.setItem("levvia_install_dismissed", "true");
            setDirection(1);
            setStep((s) => s + 1);
          }}
        />
      );
    }

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
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
              <ShieldCheck size={28} strokeWidth={1.5} className="text-accent" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-light text-foreground text-center mb-2"
          >
            {current.title}
          </motion.h1>
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed"
          >
            {current.subtitle}
          </motion.p>
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
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Heart size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-light text-foreground text-center mb-2"
          >
            {current.title}
          </motion.h1>
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed"
          >
            {current.subtitle}
          </motion.p>
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="max-w-sm mx-auto w-full"
          >
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Seu nome ou apelido"
              className="w-full px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.06] text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none transition-colors backdrop-blur-[10px]"
              autoFocus
            />
          </motion.div>
        </div>
      );
    }

    if (current.type === "number") {
      const cfg = current.numberConfig;
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Heart size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-light text-foreground text-center mb-2"
          >
            {current.title}
          </motion.h1>
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed"
          >
            {current.subtitle}
          </motion.p>
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="max-w-sm mx-auto w-full flex items-center gap-3"
          >
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
          </motion.div>
          {numberInput.trim() !== "" && (() => {
            const val = parseInt(numberInput);
            const min = cfg?.min ?? 0;
            const max = cfg?.max ?? 999;
            if (isNaN(val) || val < min || val > max) {
              return (
                <p className="text-destructive text-sm text-center mt-3">
                  Idade deve estar entre {min} e {max} anos
                </p>
              );
            }
            return null;
          })()}
        </div>
      );
    }

    if (current.type === "body_metrics") {
      return (
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Heart size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-light text-foreground text-center mb-2"
          >
            {current.title}
          </motion.h1>
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed"
          >
            {current.subtitle}
          </motion.p>
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="max-w-sm mx-auto w-full space-y-4"
          >
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
          </motion.div>
        </div>
      );
    }

    if (current.type === "result") {
      return (
        <ResultScreen fireResult={fireResult} painAnswer={painAnswer} />
      );
    }

    if (current.type === "info") {
      const objectives = (answers[16] as string[]) || [];
      const personalizedSubtitle = userName && objectives.length > 0
        ? `${userName}, reunimos todas as suas informações! Vamos ver seu diagnóstico personalizado e descobrir o melhor caminho para seus objetivos: ${objectives.join(", ")}.`
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
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-light text-foreground text-center mb-2"
          >
            {current.title}
          </motion.h1>
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

    // Pantry step
    if (current.type === "pantry") {
      const selected = (answers[current.id] as string[]) || [];
      return (
        <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex justify-center mb-4"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <ShoppingBag size={28} strokeWidth={1.5} className="text-foreground" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-light text-foreground text-center mb-2"
          >
            {current.title}
          </motion.h1>
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground text-center mb-4 max-w-sm mx-auto leading-relaxed"
          >
            {current.subtitle}
          </motion.p>

          {/* "Tenho a maioria" button */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="max-w-sm mx-auto w-full mb-4"
          >
            <button
              onClick={handleSelectMostPantry}
              className="w-full text-xs px-4 py-2.5 rounded-2xl border border-secondary/30 bg-secondary/10 text-secondary font-medium hover:bg-secondary/20 transition-all"
            >
              ✨ Tenho a maioria
            </button>
          </motion.div>

          <div className="max-w-sm mx-auto w-full space-y-4">
            {filteredPantry.map((cat, catIdx) => (
              <motion.div
                key={cat.label}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + catIdx * 0.05, duration: 0.3 }}
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {cat.emoji} {cat.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleMultiSelect(item)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selected.includes(item)
                          ? "bg-secondary text-foreground border-secondary"
                          : "bg-white/[0.06] text-muted-foreground border-white/10 hover:border-white/20"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Free text input for custom ingredients */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="max-w-sm mx-auto w-full mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
          >
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              ✍️ Não encontrou o que procura? Digite outros ingredientes:
            </label>
            <textarea
              value={customPantryInput}
              onChange={(e) => setCustomPantryInput(e.target.value)}
              placeholder="Ex: feijão branco, coentro, hortelã, azeitona"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-foreground text-sm placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none transition-colors resize-none"
            />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Separe por vírgula</p>
          </motion.div>

          {selected.length === 0 && !customPantryInput.trim() && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-muted-foreground/60 text-center mt-4 max-w-xs mx-auto"
            >
              Sem problema! Vamos sugerir receitas variadas e você escolhe o que funciona.
            </motion.p>
          )}
        </div>
      );
    }

    // Standard question screens (single / multi)
    return (
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <Heart size={28} strokeWidth={1.5} className="text-foreground" />
          </div>
        </motion.div>
        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl font-light text-foreground text-center mb-2"
        >
          {current.title}
        </motion.h1>
        {current.subtitle && (
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground text-center mb-8 max-w-sm mx-auto leading-relaxed"
          >
            {current.subtitle}
          </motion.p>
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
