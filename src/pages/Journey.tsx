import { useState, useEffect, useMemo } from "react";
import { Check, Lock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ProgressCircle from "@/components/ui/ProgressCircle";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const dayTitles: Record<number, string> = {
  1: "Consciência Corporal",
  2: "Drenagem & Inflamação",
  3: "Semáforo Alimentar",
  4: "Sono & Recuperação",
  5: "Movimento Sem Dor",
  6: "Em breve",
  7: "Em breve",
  8: "Em breve",
  9: "Em breve",
  10: "Em breve",
  11: "Em breve",
  12: "Em breve",
  13: "Em breve",
  14: "Em breve",
};

const Journey = () => {
  const { user } = useAuth();
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("profiles")
      .select("day1_completed, day2_completed, day3_completed, day4_completed, day5_completed")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const days: number[] = [];
        if (data.day1_completed) days.push(1);
        if (data.day2_completed) days.push(2);
        if (data.day3_completed) days.push(3);
        if (data.day4_completed) days.push(4);
        if (data.day5_completed) days.push(5);
        setCompletedDays(days);
      });
  }, [user?.id]);

  const totalCompleted = completedDays.length;
  const nextDay = totalCompleted + 1;

  return (
    <div className="levvia-page min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src={logoIcon} alt="Levvia" className="h-7" />
        </div>
        <h1 className="text-[26px] font-heading font-semibold text-levvia-fg tracking-tight">
          Sua Jornada
        </h1>
        <p className="text-[13px] text-levvia-muted font-body mt-1">
          Jornada de Consciência
        </p>
      </header>

      {/* Progress circle */}
      <div className="flex justify-center mb-8">
        <div className="levvia-card flex flex-col items-center p-6">
          <p className="text-[11px] font-medium text-levvia-muted uppercase tracking-wider mb-4 font-body">
            Progresso da Jornada
          </p>
          <ProgressCircle
            value={totalCompleted}
            max={14}
            size="sm"
            color="#2EC4B6"
            label="dias completos"
          />
          <p className="text-xs text-levvia-muted font-body mt-3">
            {Math.round((totalCompleted / 14) * 100)}% completo
          </p>
        </div>
      </div>

      {/* Day list */}
      <main className="px-5 space-y-2">
        {Array.from({ length: 14 }, (_, i) => {
          const day = i + 1;
          const isCompleted = completedDays.includes(day);
          const isNext = day === nextDay && day <= 5;
          const isLocked = !isCompleted && !isNext;

          return (
            <div
              key={day}
              className={`levvia-card flex items-center gap-4 p-4 transition-all ${
                isCompleted ? "border-levvia-success/20" : isNext ? "border-levvia-warning/30" : "opacity-60"
              }`}
            >
              {/* Status icon */}
              <div
                className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? "border-levvia-success"
                    : isNext
                    ? "border-levvia-warning"
                    : "border-gray-300"
                }`}
              >
                {isCompleted && (
                  <Check size={13} strokeWidth={2.5} className="text-levvia-success" />
                )}
                {isLocked && (
                  <Lock size={10} strokeWidth={2} className="text-gray-300" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium font-body ${isCompleted ? "text-levvia-fg" : isNext ? "text-levvia-fg" : "text-levvia-muted"}`}>
                  Dia {day}
                </p>
                <p className="text-[11px] text-levvia-muted font-body truncate">
                  {dayTitles[day]}
                </p>
              </div>

              {/* Badge */}
              {isCompleted && (
                <span className="text-[10px] font-medium text-levvia-success bg-levvia-success/10 px-2 py-0.5 rounded-full font-body">
                  Completo
                </span>
              )}
              {isNext && (
                <span className="text-[10px] font-medium text-levvia-warning bg-levvia-warning/10 px-2 py-0.5 rounded-full font-body">
                  Próximo
                </span>
              )}
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default Journey;
