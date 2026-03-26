import { useState, useEffect, useRef } from "react";
import { Clock, Sparkles, ArrowDown } from "lucide-react";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";
import BottomNav from "@/components/BottomNav";

interface WaitingScreenProps {
  completedAt: string;
  nextDay: number;
  onReady: () => void;
}

function getTimeRemaining(completedAt: string) {
  const unlockTime = new Date(completedAt).getTime() + 24 * 60 * 60 * 1000;
  const now = Date.now();
  const diff = unlockTime - now;

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, total: diff };
}

const WaitingScreen = ({ completedAt, nextDay, onReady }: WaitingScreenProps) => {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(completedAt));
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const interval = setInterval(() => {
      const r = getTimeRemaining(completedAt);
      if (!r) {
        clearInterval(interval);
        onReadyRef.current();
      }
      setRemaining(r);
    }, 1000);
    return () => clearInterval(interval);
  }, [completedAt]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const previousDay = nextDay - 1;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-page px-6 pt-16 pb-12 rounded-b-3xl">
        <div className="flex justify-center mb-6">
          <img src={logoIcon} alt="Levvia" className="w-10 h-auto" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} strokeWidth={1.5} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">
              Dia {previousDay} completo!
            </span>
          </div>
          <h1 className="text-2xl font-light text-foreground mt-2">
            Parabéns pela dedicação! 🎉
          </h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs mx-auto">
            Seu corpo precisa de tempo para absorver os benefícios de hoje.
            O Dia {nextDay} será liberado à meia-noite.
          </p>
        </div>

        {/* Countdown */}
        <div className="glass-card p-6 max-w-xs mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock size={18} strokeWidth={1.5} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">
              Dia {nextDay} disponível em
            </span>
          </div>

          {remaining ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-light text-foreground tabular-nums">
                  {pad(remaining.hours)}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                  horas
                </span>
              </div>
              <span className="text-2xl text-muted-foreground font-light">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-light text-foreground tabular-nums">
                  {pad(remaining.minutes)}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                  min
                </span>
              </div>
              <span className="text-2xl text-muted-foreground font-light">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-light text-foreground tabular-nums">
                  {pad(remaining.seconds)}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                  seg
                </span>
              </div>
            </div>
          ) : (
            <p className="text-foreground font-medium">Liberado! 🎉</p>
          )}
        </div>

        {/* Hint to scroll */}
        <div className="mt-8 flex flex-col items-center gap-1 animate-bounce">
          <ArrowDown size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Enquanto isso, explore suas atividades diárias
          </span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default WaitingScreen;
