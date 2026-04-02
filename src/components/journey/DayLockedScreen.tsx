import { useState, useEffect } from "react";
import { Lock, Moon, Bell, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEV_BYPASS_DAY_LOCK } from "@/lib/config";

interface DayLockedScreenProps {
  dayNumber: number;
  theme: string;
  preview: string[];
  isPreviousDayComplete: boolean;
  compact?: boolean;
  onUnlock: () => void;
  onGoBack?: () => void;
}

const formatTime = (ms: number) => {
  if (ms <= 0) return { h: "00", m: "00", s: "00" };
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return { h, m, s };
};

const DayLockedScreen = ({
  dayNumber,
  theme,
  preview,
  isPreviousDayComplete,
  compact = false,
  onUnlock,
  onGoBack,
}: DayLockedScreenProps) => {
  const [remaining, setRemaining] = useState(() => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - Date.now();
  });

  useEffect(() => {
    if (DEV_BYPASS_DAY_LOCK && !compact) { onUnlock(); return; }
    if (!isPreviousDayComplete) return;
    const timer = setInterval(() => {
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        onUnlock();
      } else {
        setRemaining(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPreviousDayComplete, onUnlock]);

  const time = formatTime(remaining);

  if (compact) {
    return (
      <div className="levvia-card p-5 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Moon size={16} className="text-primary" strokeWidth={1.5} />
          <p className="text-sm font-heading font-semibold text-levvia-fg">
            Dia {dayNumber} · {theme}
          </p>
        </div>

        <p className="text-xs text-levvia-muted font-body mb-3">
          O Dia {dayNumber} abre em:
        </p>

        <div className="flex items-center justify-center gap-2 mb-4">
          {[
            { val: time.h, label: "h" },
            { val: time.m, label: "m" },
            { val: time.s, label: "s" },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-2xl font-heading font-bold text-primary tabular-nums">
                {val}
              </span>
              <span className="text-[10px] text-levvia-muted uppercase">{label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          {preview.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <Sparkles size={12} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
              <span className="text-xs text-levvia-muted font-body">{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center px-6">
      {onGoBack && (
        <button
          onClick={onGoBack}
          className="absolute top-6 left-6 flex items-center gap-1 text-sm text-levvia-muted font-body"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>
      )}

      <div className="flex flex-col items-center text-center max-w-sm w-full">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {isPreviousDayComplete ? (
            <Moon size={28} className="text-primary" strokeWidth={1.5} />
          ) : (
            <Lock size={28} className="text-primary" strokeWidth={1.5} />
          )}
        </div>

        <h2 className="text-xl font-heading font-semibold text-levvia-fg mb-1">
          Dia {dayNumber} · {theme}
        </h2>

        {isPreviousDayComplete ? (
          <>
            <p className="text-sm text-levvia-muted font-body mt-2 leading-relaxed">
              Seu corpo está processando o que aprendeu hoje.
            </p>
            <p className="text-sm text-levvia-muted font-body mt-1">
              O Dia {dayNumber} abre em:
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              {[
                { val: time.h, label: "horas" },
                { val: time.m, label: "min" },
                { val: time.s, label: "seg" },
              ].map(({ val, label }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-heading font-bold text-primary tabular-nums">
                      {val}
                    </span>
                    <span className="text-[10px] text-levvia-muted uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <span className="text-2xl font-bold text-levvia-muted/40 -mt-4">:</span>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-levvia-muted font-body mt-2 leading-relaxed">
              Conclua o Dia {dayNumber - 1} para liberar este dia.
            </p>
            {onGoBack && (
              <Button
                onClick={onGoBack}
                className="mt-5 rounded-xl"
              >
                Voltar ao Dia {dayNumber - 1}
              </Button>
            )}
          </>
        )}

        <div className="w-full mt-8 pt-6 border-t border-border">
          <p className="text-xs font-medium text-levvia-muted uppercase tracking-wider mb-3 font-body">
            O que vem no Dia {dayNumber}
          </p>
          <div className="space-y-2.5">
            {preview.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-left">
                <Sparkles size={14} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-levvia-fg font-body">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {isPreviousDayComplete && (
          <Button
            variant="outline"
            className="mt-6 rounded-xl gap-2"
            onClick={() => {}}
          >
            <Bell size={14} />
            Lembrar-me à meia-noite
          </Button>
        )}
      </div>
    </div>
  );
};

export default DayLockedScreen;
