import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Lock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import ProgressCircle from "@/components/ui/ProgressCircle";
import DayLockedScreen from "@/components/journey/DayLockedScreen";
import logoFull from "@/assets/logo_livvia_azul.png";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getTouchpointConfig } from "@/data/touchpointConfig";
import { DEV_BYPASS_DAY_LOCK } from "@/lib/config";

const DAY_PREVIEWS: Record<number, string[]> = {
  1: ["Respiração diafragmática", "Refeição anti-inflamatória", "Mapa do Fogo Interno"],
  2: ["Exercício de drenagem linfática", "Refeição anti-inflamatória especial", "Técnica de drenagem noturna"],
  3: ["Movimento articular suave", "Cardápio personalizado", "Semáforo alimentar"],
  4: ["Bombeamento de panturrilha", "Cardápio noturno", "Higiene do sono"],
  5: ["Exercício de mobilidade", "Almoço especial", "Elevação de pernas"],
  6: ["Movimento circular", "Especiarias medicinais", "Técnica de relaxamento"],
  7: ["Exercício de fortalecimento", "Receita especial", "Técnica de respiração"],
  8: ["Movimento intestinal", "Receita probiótica", "Automassagem abdominal"],
  9: ["Exercício de resistência", "Receita energizante", "Meditação guiada"],
  10: ["Exercício funcional", "Receita com suplementos", "Diário de evolução"],
  11: ["Automassagem terapêutica", "Receita reconfortante", "Técnica de compressão"],
  12: ["Exercício integrado", "Receita celebratória", "Visualização guiada"],
  13: ["Planejamento de rotina", "Receita do futuro", "Metas de longo prazo"],
  14: ["Exercício completo", "Receita especial final", "Mapa comparativo"],
};

const daySubtitles: Record<number, string> = {
  1: "Mapeou seu Fogo Interno",
  2: "Sentiu alívio com drenagem",
  3: "Escolhas anti-inflamatórias",
  4: "Noite reparadora",
  5: "Gentileza com o corpo",
  6: "Especiarias medicinais",
  7: "O Marco da Leveza",
  8: "Intestino como aliado",
  9: "Resiliência em ação",
  10: "Sabedoria em suplementos",
  11: "Mãos que cuidam",
  12: "A nova identidade",
  13: "Planejando o futuro",
  14: "Sua Nova Vida",
};

type SlotStatus = { morning: boolean; lunch: boolean; afternoon: boolean; night: boolean };

const Journey = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [touchpointData, setTouchpointData] = useState<Record<number, SlotStatus>>({});
  const [lockedDay, setLockedDay] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("profiles")
      .select("day1_completed, day2_completed, day3_completed, day4_completed, day5_completed, day6_completed, challenge_progress")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;

        const days: number[] = [];
        const legacyFlags: Record<number, boolean> = {
          1: !!data.day1_completed,
          2: !!data.day2_completed,
          3: !!data.day3_completed,
          4: !!data.day4_completed,
          5: !!data.day5_completed,
          6: !!data.day6_completed,
        };

        const cp = (data.challenge_progress as any) ?? {};
        const touchpoints = cp?.touchpoints ?? {};
        const tpMap: Record<number, SlotStatus> = {};

        for (let d = 1; d <= 14; d++) {
          const dayTp = touchpoints?.[`day${d}`] ?? {};
          tpMap[d] = {
            morning: !!dayTp?.morning?.done,
            lunch: !!dayTp?.lunch?.done,
            afternoon: !!dayTp?.afternoon?.done,
            night: !!dayTp?.night?.done,
          };

          const isComplete = tpMap[d].night || (legacyFlags[d] ?? false);
          if (isComplete) days.push(d);
        }

        setCompletedDays(days);
        setTouchpointData(tpMap);
      });
  }, [user?.id]);

  const totalCompleted = completedDays.length;

  const isDayCompleted = (day: number) => completedDays.includes(day);

  const isDayUnlocked = (day: number) => {
    if (day === 1) return true;
    return isDayCompleted(day - 1);
  };

  const handleDayClick = (day: number) => {
    if (!isDayUnlocked(day)) {
      setLockedDay(day);
      return;
    }
    if (isDayCompleted(day)) {
      navigate(`/today?review=${day}`);
    } else {
      navigate("/today");
    }
  };

  return (
    <div className="theme-light levvia-page min-h-screen pb-24">
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

      <div className="flex justify-center mb-8">
        <div className="levvia-card flex flex-col items-center p-6">
          <p className="text-[11px] font-medium text-levvia-muted uppercase tracking-wider mb-4 font-body">
            Progresso da Jornada
          </p>
          <ProgressCircle value={totalCompleted} max={14} size="sm" color="#2EC4B6" label="dias completos" />
          <p className="text-xs text-levvia-muted font-body mt-3">
            {Math.round((totalCompleted / 14) * 100)}% completo
          </p>
        </div>
      </div>

      <main className="px-5 space-y-2">
        {Array.from({ length: 14 }, (_, i) => {
          const day = i + 1;
          const config = getTouchpointConfig(day);
          const completed = isDayCompleted(day);
          const unlocked = isDayUnlocked(day);
          const isNext = unlocked && !completed && (day === 1 || isDayCompleted(day - 1));
          const locked = !unlocked;
          const tp = touchpointData[day];
          const hasAnyTp = tp && (tp.morning || tp.lunch || tp.afternoon || tp.night);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={locked}
              className={`levvia-card flex items-center gap-4 p-4 w-full text-left transition-all ${
                completed
                  ? "border-levvia-success/20 cursor-pointer hover:border-levvia-success/40"
                  : unlocked
                  ? "border-levvia-warning/30 cursor-pointer hover:border-levvia-warning/50"
                  : "opacity-60 cursor-default"
              }`}
            >
              <div
                className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                  completed
                    ? "border-levvia-success"
                    : isNext
                    ? "border-levvia-warning"
                    : "border-gray-300"
                }`}
              >
                {completed && <Check size={13} strokeWidth={2.5} className="text-levvia-success" />}
                {locked && <Lock size={10} strokeWidth={2} className="text-gray-300" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium font-body ${completed || unlocked ? "text-levvia-fg" : "text-levvia-muted"}`}>
                  Dia {day}
                </p>
                <p className="text-[11px] text-levvia-muted font-body truncate">
                  {config.theme}
                </p>
                {completed && daySubtitles[day] && (
                  <p className="text-[10px] text-levvia-success font-body mt-0.5">
                    {daySubtitles[day]}
                  </p>
                )}

                {hasAnyTp && tp && (
                  <div className="mt-1.5">
                    <div className="flex gap-1.5">
                      <span className={`w-2 h-2 rounded-full inline-block ${tp.morning ? "bg-primary" : "bg-muted"}`} />
                      <span className={`w-2 h-2 rounded-full inline-block ${tp.lunch ? "bg-primary" : "bg-muted"}`} />
                      <span className={`w-2 h-2 rounded-full inline-block ${tp.afternoon ? "bg-primary" : "bg-muted"}`} />
                      <span className={`w-2 h-2 rounded-full inline-block ${tp.night ? "bg-primary" : "bg-muted"}`} />
                    </div>
                    <div className="flex gap-1.5 mt-0.5">
                      <span className="text-[8px] text-levvia-muted w-2 text-center">M</span>
                      <span className="text-[8px] text-levvia-muted w-2 text-center">A</span>
                      <span className="text-[8px] text-levvia-muted w-2 text-center">T</span>
                      <span className="text-[8px] text-levvia-muted w-2 text-center">N</span>
                    </div>
                  </div>
                )}
              </div>

              {completed && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-levvia-success bg-levvia-success/10 px-2 py-0.5 rounded-full font-body">
                    Rever
                  </span>
                  <ChevronRight size={14} className="text-levvia-muted" />
                </div>
              )}
              {isNext && !completed && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-levvia-warning bg-levvia-warning/10 px-2 py-0.5 rounded-full font-body">
                    Próximo
                  </span>
                  <ChevronRight size={14} className="text-levvia-warning" />
                </div>
              )}
              {unlocked && !completed && !isNext && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full font-body">
                    Disponível
                  </span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </main>

      {lockedDay !== null && (
        <DayLockedScreen
          dayNumber={lockedDay}
          theme={getTouchpointConfig(lockedDay).theme}
          preview={DAY_PREVIEWS[lockedDay] ?? ["Exercício guiado", "Receita anti-inflamatória", "Técnica noturna"]}
          isPreviousDayComplete={isDayCompleted(lockedDay - 1)}
          onUnlock={() => {
            setLockedDay(null);
            navigate("/today");
          }}
          onGoBack={() => setLockedDay(null)}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Journey;
