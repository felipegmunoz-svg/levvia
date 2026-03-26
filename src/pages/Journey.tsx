import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ProgressCircle from "@/components/ui/ProgressCircle";
import logoFull from "@/assets/logo_livvia_azul.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const dayTitles: Record<number, string> = {
  1: "Consciência Corporal",
  2: "Drenagem & Inflamação",
  3: "Semáforo Alimentar",
  4: "Sono & Recuperação",
  5: "Movimento Sem Dor",
  6: "O Poder das Especiarias",
  7: "Em breve",
  8: "Em breve",
  9: "Em breve",
  10: "Em breve",
  11: "Em breve",
  12: "Em breve",
  13: "Em breve",
  14: "Em breve",
};

const daySubtitles: Record<number, string> = {
  1: "Mapeou seu Fogo Interno",
  2: "Sentiu alívio com drenagem",
  3: "Escolhas anti-inflamatórias",
  4: "Noite reparadora",
  5: "Gentileza com o corpo",
  6: "Especiarias medicinais",
};

const Journey = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("profiles")
      .select("day1_completed, day2_completed, day3_completed, day4_completed, day5_completed, day6_completed")
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
        if (data.day6_completed) days.push(6);
        setCompletedDays(days);
      });
  }, [user?.id]);

  const totalCompleted = completedDays.length;
  const nextDay = totalCompleted + 1;

  const handleDayClick = (day: number) => {
    if (day > 6) return; // days 7-14 locked
    const isCompleted = completedDays.includes(day);
    if (isCompleted) {
      navigate(`/today?review=${day}`);
    } else {
      // Linear mode: any uncompleted day navigates to /today (sequential flow handles it)
      navigate("/today");
    }
  };

  return (
    <div className="levvia-page min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-10 pb-6">
        <div className="flex justify-center mb-4">
          <img src={logoFull} alt="Levvia" className="h-10" />
        </div>
        <h1 className="text-[26px] font-heading font-semibold text-levvia-fg tracking-tight text-center">
          Sua Jornada
        </h1>
        <p className="text-[13px] text-levvia-muted font-body mt-1 text-center">
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
          const isAvailable = day <= 6; // days 1-6 always available in linear mode
          const isNext = day === nextDay && day <= 6;
          const isLocked = !isAvailable;
          const isClickable = isAvailable;

          return (
            <button
              key={day}
              onClick={() => isClickable && handleDayClick(day)}
              disabled={!isClickable}
              className={`levvia-card flex items-center gap-4 p-4 w-full text-left transition-all ${
                isCompleted
                  ? "border-levvia-success/20 cursor-pointer hover:border-levvia-success/40"
                  : isNext
                  ? "border-levvia-warning/30 cursor-pointer hover:border-levvia-warning/50"
                  : "opacity-60 cursor-default"
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
                <p
                  className={`text-[13px] font-medium font-body ${
                    isCompleted || isNext ? "text-levvia-fg" : "text-levvia-muted"
                  }`}
                >
                  Dia {day}
                </p>
                <p className="text-[11px] text-levvia-muted font-body truncate">
                  {dayTitles[day]}
                </p>
                {isCompleted && daySubtitles[day] && (
                  <p className="text-[10px] text-levvia-success font-body mt-0.5">
                    {daySubtitles[day]}
                  </p>
                )}
              </div>

              {/* Badge / Arrow */}
              {isCompleted && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-levvia-success bg-levvia-success/10 px-2 py-0.5 rounded-full font-body">
                    Rever
                  </span>
                  <ChevronRight size={14} className="text-levvia-muted" />
                </div>
              )}
              {isNext && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-levvia-warning bg-levvia-warning/10 px-2 py-0.5 rounded-full font-body">
                    Próximo
                  </span>
                  <ChevronRight size={14} className="text-levvia-warning" />
                </div>
              )}
            </button>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default Journey;
