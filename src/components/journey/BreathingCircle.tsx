import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BreathingCircleProps {
  onContinue: () => void;
}

type Phase = "inhale" | "hold" | "exhale";

const PHASE_DURATION: Record<Phase, number> = {
  inhale: 4000,
  hold: 7000,
  exhale: 8000,
};

const PHASE_LABEL: Record<Phase, string> = {
  inhale: "Inspire",
  hold: "Segure",
  exhale: "Expire",
};

const PHASE_SECONDS: Record<Phase, number> = {
  inhale: 4,
  hold: 7,
  exhale: 8,
};

const BreathingCircle = ({ onContinue }: BreathingCircleProps) => {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  useEffect(() => {
    if (!isActive) {
      clearTimers();
      return;
    }

    setCountdown(PHASE_SECONDS[phase]);

    countdownRef.current = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    timerRef.current = setTimeout(() => {
      if (phase === "inhale") {
        setPhase("hold");
      } else if (phase === "hold") {
        setPhase("exhale");
      } else {
        setCycles((c) => c + 1);
        setPhase("inhale");
      }
    }, PHASE_DURATION[phase]);

    return clearTimers;
  }, [isActive, phase, clearTimers]);

  const canFinish = cycles >= 3;

  const toggleActive = () => setIsActive(!isActive);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center w-full max-w-md"
      >
        <h2
          className="text-foreground mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
          }}
        >
          Respiração 4-7-8
        </h2>
        <p
          className="text-foreground/60 mb-10 max-w-sm mx-auto"
          style={{ fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.7 }}
        >
          Acalma o sistema nervoso e prepara seu corpo para o sono profundo.
          Faça ao menos 3 ciclos completos.
        </p>

        {/* Circle — clickable to start/pause */}
        <div
          className="relative w-56 h-56 mx-auto mb-10 cursor-pointer"
          onClick={toggleActive}
          role="button"
          aria-label={isActive ? "Pausar respiração" : "Iniciar respiração"}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(var(--secondary) / 0.15), transparent 70%)",
            }}
            animate={{
              scale: phase === "inhale" ? 1.6 : phase === "hold" ? 1.6 : 1,
            }}
            transition={{
              duration: phase === "inhale" ? 4 : phase === "hold" ? 0.3 : 8,
              ease: "easeInOut",
            }}
          />

          {/* Main circle */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-secondary/30"
            style={{
              background: "linear-gradient(135deg, hsl(var(--secondary) / 0.2), hsl(var(--primary) / 0.15))",
            }}
            animate={{
              scale: phase === "inhale" ? 1.4 : phase === "hold" ? 1.4 : 1,
            }}
            transition={{
              duration: phase === "inhale" ? 4 : phase === "hold" ? 0.3 : 8,
              ease: "easeInOut",
            }}
          />

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              {isActive ? (
                <>
                  <p className="text-foreground text-lg font-medium mb-1">
                    {PHASE_LABEL[phase]}
                  </p>
                  <p className="text-secondary text-3xl font-light">{countdown}s</p>
                  <p className="text-foreground/40 text-xs mt-1">Ciclo {cycles + 1}</p>
                  <p className="text-foreground/30 text-[10px] mt-2">Toque para pausar</p>
                </>
              ) : (
                <p className="text-foreground/50 text-sm" style={{ fontWeight: 300 }}>
                  {cycles > 0 ? "Toque para retomar" : "Toque para iniciar"}
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-foreground/40 mb-6">
          {cycles}/3 ciclos completos
        </p>
      </motion.div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/5 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <div className="max-w-xs mx-auto space-y-3">
          {!isActive && !canFinish && (
            <button
              onClick={toggleActive}
              className="w-full py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm"
            >
              {cycles > 0 ? "Retomar" : "Começar Respiração Guiada"}
            </button>
          )}


          <AnimatePresence>
            {canFinish && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsActive(false);
                  onContinue();
                }}
                className="w-full py-4 rounded-3xl bg-success/20 text-success font-medium text-sm"
              >
                ✓ Continuar para Cardápio Noturno →
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BreathingCircle;
