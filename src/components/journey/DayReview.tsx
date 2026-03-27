import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import HeatMapInteractive from "./HeatMapInteractive";
import logoFull from "@/assets/logo_livvia_azul.png";

interface ProfileData {
  heat_map_day1: Record<string, number> | null;
  day2_inflammation_map: Record<string, unknown> | null;
  day4_sleep_data: Record<string, unknown> | null;
  day5_movement_data: Record<string, unknown> | null;
  day6_spice_data: Record<string, unknown> | null;
  day1_completed_at: string | null;
  day2_completed_at: string | null;
  day3_completed_at: string | null;
  day4_completed_at: string | null;
  day5_completed_at: string | null;
  day6_completed_at: string | null;
}

const dayTitles: Record<number, string> = {
  1: "Dia 1 — Consciência Corporal",
  2: "Dia 2 — Hidratação Inteligente",
  3: "Dia 3 — Semáforo Alimentar",
  4: "Dia 4 — O Sono que Cura",
  5: "Dia 5 — Movimento Sem Dor",
  6: "Dia 6 — O Poder das Especiarias",
};

const dayIcons: Record<number, string> = {
  1: "🔥", 2: "💧", 3: "🚦", 4: "😴", 5: "🏃‍♀️", 6: "🌿",
};

const dayDescriptions: Record<number, string> = {
  1: "Você mapeou suas áreas de desconforto e fez sua primeira escolha consciente.",
  2: "Você praticou drenagem linfática e mapeou seus focos de inflamação.",
  3: "Você aprendeu a classificar alimentos pelo seu potencial inflamatório.",
  4: "Você criou um ritual de sono reparador e praticou respiração 4-7-8.",
  5: "Você ativou sua bomba linfática com exercícios gentis e registrou sua evolução.",
  6: "Você descobriu o poder das especiarias anti-inflamatórias na sua rotina.",
};

const areaNames: Record<string, string> = {
  ombro_esq: "Ombro Esquerdo",
  ombro_dir: "Ombro Direito",
  braco_esq: "Braço Esquerdo",
  braco_dir: "Braço Direito",
  mao_esq: "Mão Esquerda",
  mao_dir: "Mão Direita",
  coxa_esq: "Coxa Esquerda",
  coxa_dir: "Coxa Direita",
  joelho_esq: "Joelho Esquerdo",
  joelho_dir: "Joelho Direito",
  panturrilha_esq: "Panturrilha Esquerda",
  panturrilha_dir: "Panturrilha Direita",
  pe_esq: "Pé Esquerdo",
  pe_dir: "Pé Direito",
  abdomen: "Abdômen",
  quadril: "Quadril",
  lombar: "Lombar",
  pescoco: "Pescoço",
  torax: "Tórax",
  costas: "Costas",
};

const typeIcons: Record<string, string> = {
  dor: "🔴 Dor",
  inchaco: "🟡 Inchaço",
  peso: "🔵 Peso",
  sensibilidade: "🟣 Sensibilidade",
};

const hygieneLabels: Record<string, string> = {
  screens_off: "Telas desligadas 1h antes",
  warm_bath: "Banho morno",
  light_reading: "Leitura leve",
  calming_tea: "Chá calmante",
  dark_room: "Quarto escuro e fresco",
};

const spiceActivityLabels: Record<string, string> = {
  curcuma_tea: "Chá de Cúrcuma",
  green_spices: "Especiarias Verdes",
  self_massage: "Auto-massagem com Óleos",
  anti_inflammatory_dinner: "Jantar Anti-inflamatório",
};

const CheckItem = ({ checked, label }: { checked: boolean; label: string }) => (
  <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
    <span>{checked ? "✅" : "⬜"}</span>
    <span className="text-sm text-foreground">{label}</span>
  </div>
);

const SectionCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div className="levvia-card p-5 space-y-3">
    <h3 className="font-semibold text-foreground flex items-center gap-2">
      <span>{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const EmptyState = ({ msg }: { msg: string }) => (
  <p className="text-sm text-muted-foreground">{msg}</p>
);

const DayReview = () => {
  const [searchParams] = useSearchParams();
  const dayNum = Number(searchParams.get("review"));
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.id || !dayNum) { setLoading(false); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("heat_map_day1, day2_inflammation_map, day4_sleep_data, day5_movement_data, day6_spice_data, day1_completed_at, day2_completed_at, day3_completed_at, day4_completed_at, day5_completed_at, day6_completed_at")
        .eq("id", user.id)
        .maybeSingle();
      setData(profile as unknown as ProfileData);
      setLoading(false);
    };
    load();
  }, [user?.id, dayNum]);

  if (!dayNum || dayNum < 1 || dayNum > 6) { navigate("/journey"); return null; }

  if (loading) {
    return (
      <div className="theme-light levvia-page min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedAt = data?.[`day${dayNum}_completed_at` as keyof ProfileData] as string | null;

  const renderDay1 = () => (
    <SectionCard icon="🗺️" title="Seu Mapa de Calor">
      {data?.heat_map_day1 && Object.values(data.heat_map_day1).some((v) => typeof v === "number" && v > 0) ? (
        <HeatMapInteractive initialData={data.heat_map_day1 as Record<string, number>} readOnly size="small" />
      ) : (
        <EmptyState msg="Nenhuma área marcada." />
      )}
    </SectionCard>
  );

  const renderDay2 = () => {
    const map = data?.day2_inflammation_map as Record<string, unknown> | null;
    if (!map) return <SectionCard icon="🔥" title="Mapa de Inflamação"><EmptyState msg="Nenhum dado de inflamação registrado." /></SectionCard>;

    const markedAreas = (map.markedAreas as Array<{ area: string; types: string[] }>) || [];
    const notes = map.notes as string | undefined;

    if (markedAreas.length === 0 && !notes) {
      return <SectionCard icon="🔥" title="Mapa de Inflamação"><EmptyState msg="Nenhum dado de inflamação registrado." /></SectionCard>;
    }

    return (
      <div className="space-y-3">
        <SectionCard icon="🔥" title="Mapa de Inflamação">
          {markedAreas.length > 0 ? (
            <div className="space-y-2">
              {markedAreas.map((item, i) => (
                <div key={i} className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {areaNames[item.area] || item.area}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.types.map((t) => (
                      <span key={t} className="text-xs bg-background rounded-full px-2 py-0.5 border border-border">
                        {typeIcons[t] || t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState msg="Nenhuma área marcada." />
          )}
        </SectionCard>
        {notes && (
          <SectionCard icon="📝" title="Observações">
            <p className="text-sm text-foreground">{notes}</p>
          </SectionCard>
        )}
      </div>
    );
  };

  const renderDay3 = () => (
    <div className="space-y-3">
      <SectionCard icon="🚦" title="Semáforo Alimentar">
        <div className="space-y-2">
          <div className="rounded-lg p-3 border-l-4 border-l-green-500 bg-muted">
            <p className="text-sm font-medium text-foreground">🟢 PRIORIZE</p>
            <p className="text-xs text-muted-foreground mt-1">Frutas, vegetais, peixes, azeite, cúrcuma</p>
          </div>
          <div className="rounded-lg p-3 border-l-4 border-l-yellow-500 bg-muted">
            <p className="text-sm font-medium text-foreground">🟡 MODERE</p>
            <p className="text-xs text-muted-foreground mt-1">Arroz branco, pão integral, café, chocolate 70%</p>
          </div>
          <div className="rounded-lg p-3 border-l-4 border-l-red-500 bg-muted">
            <p className="text-sm font-medium text-foreground">🔴 EVITE</p>
            <p className="text-xs text-muted-foreground mt-1">Açúcar refinado, fritura, ultraprocessados, álcool</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Você aprendeu a identificar o potencial inflamatório de cada alimento.</p>
      </SectionCard>
    </div>
  );

  const renderDay4 = () => {
    const sleep = data?.day4_sleep_data as Record<string, unknown> | null;
    if (!sleep) return <SectionCard icon="😴" title="Dados de Sono"><EmptyState msg="Nenhum dado de sono registrado." /></SectionCard>;

    const checklist = (sleep.hygieneChecklist as Record<string, boolean>) || {};
    const breathingDone = sleep.breathingCompleted as boolean | undefined;
    const createdAt = sleep.createdAt as string | undefined;

    return (
      <div className="space-y-3">
        <SectionCard icon="🛏️" title="Checklist de Higiene do Sono">
          {Object.entries(hygieneLabels).map(([key, label]) => (
            <CheckItem key={key} checked={!!checklist[key]} label={label} />
          ))}
        </SectionCard>
        <SectionCard icon="🌬️" title="Respiração 4-7-8">
          <p className="text-sm text-foreground">
            {breathingDone ? "✅ Completada" : "Não praticada"}
          </p>
          {createdAt && (
            <p className="text-xs text-muted-foreground">
              Registrado em {new Date(createdAt).toLocaleDateString("pt-BR")}
            </p>
          )}
        </SectionCard>
      </div>
    );
  };

  const renderDay5 = () => {
    const mov = data?.day5_movement_data as Record<string, unknown> | null;
    if (!mov) return <SectionCard icon="🏃‍♀️" title="Dados de Movimento"><EmptyState msg="Nenhum dado de movimento registrado." /></SectionCard>;

    const exercises = (mov.exercisesCompleted as Record<string, boolean>) || {};
    const lunchChoice = mov.lunchChoice as string | undefined;
    const snackChoice = mov.snackChoice as string | undefined;
    const microChallenge = mov.microChallengeCompleted as boolean | undefined;
    const legsMin = mov.legsElevationDuration as number | undefined;
    const journal = mov.journalEntry as Record<string, unknown> | undefined;

    return (
      <div className="space-y-3">
        {Object.keys(exercises).length > 0 && (
          <SectionCard icon="💪" title="Exercícios">
            {Object.entries(exercises).map(([key, done]) => (
              <CheckItem key={key} checked={!!done} label={key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} />
            ))}
          </SectionCard>
        )}
        {(lunchChoice || snackChoice) && (
          <SectionCard icon="🍽️" title="Refeições">
            {lunchChoice && <p className="text-sm text-foreground">Almoço: {lunchChoice}</p>}
            {snackChoice && <p className="text-sm text-foreground">Lanche: {snackChoice}</p>}
          </SectionCard>
        )}
        <SectionCard icon="⚡" title="Micro-Desafio">
          <p className="text-sm text-foreground">
            {microChallenge ? "✅ Marcha parada completada" : "Não realizado"}
          </p>
        </SectionCard>
        {legsMin !== undefined && (
          <SectionCard icon="🦵" title="Elevação de Pernas">
            <p className="text-sm text-foreground">{legsMin} minutos</p>
          </SectionCard>
        )}
        {journal && (
          <SectionCard icon="📓" title="Diário">
            {journal.legsSensation && <p className="text-sm text-foreground">Sensação nas pernas: {String(journal.legsSensation)}</p>}
            {journal.energyLevel && <p className="text-sm text-foreground">Nível de energia: {String(journal.energyLevel)}</p>}
            {journal.notes && <p className="text-sm text-muted-foreground mt-1">{String(journal.notes)}</p>}
          </SectionCard>
        )}
      </div>
    );
  };

  const renderDay6 = () => {
    const spice = data?.day6_spice_data as Record<string, unknown> | null;
    if (!spice) return <SectionCard icon="🌿" title="Dados de Especiarias"><EmptyState msg="Nenhum dado registrado." /></SectionCard>;

    const activities = (spice.activitiesCompleted as Record<string, boolean>) || {};
    const diary = spice.diaryData as Record<string, unknown> | undefined;

    return (
      <div className="space-y-3">
        <SectionCard icon="🌿" title="Atividades">
          {Object.entries(spiceActivityLabels).map(([key, label]) => (
            <CheckItem key={key} checked={!!activities[key]} label={label} />
          ))}
        </SectionCard>
        {diary && (
          <SectionCard icon="📓" title="Reflexão do Dia">
            {diary.legSensation && <p className="text-sm text-foreground">Sensação nas pernas: {String(diary.legSensation)}</p>}
            {diary.energyLevel && <p className="text-sm text-foreground">Nível de energia: {String(diary.energyLevel)}</p>}
            {diary.notes && <p className="text-sm text-muted-foreground mt-1">{String(diary.notes)}</p>}
          </SectionCard>
        )}
      </div>
    );
  };

  const renderDayContent = () => {
    switch (dayNum) {
      case 1: return renderDay1();
      case 2: return renderDay2();
      case 3: return renderDay3();
      case 4: return renderDay4();
      case 5: return renderDay5();
      case 6: return renderDay6();
      default: return null;
    }
  };

  return (
    <div className="theme-light levvia-page min-h-screen pb-24">
      <header className="px-6 pt-8 pb-4">
        <div className="flex justify-center">
          <img src={logoFull} alt="Levvia" className="h-10" />
        </div>
      </header>

      <div className="px-6 space-y-6">
        <div className="levvia-card p-6 text-center space-y-3">
          <span className="text-4xl">{dayIcons[dayNum]}</span>
          <h1 className="text-xl font-bold text-foreground">{dayTitles[dayNum]}</h1>
          <p className="text-sm text-muted-foreground">{dayDescriptions[dayNum]}</p>
          {completedAt && (
            <p className="text-xs text-muted-foreground">
              Concluído em {new Date(completedAt).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>

        {renderDayContent()}

        <button
          onClick={() => navigate("/journey")}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium text-base hover:opacity-90 transition-opacity"
        >
          ← Voltar para Jornada
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default DayReview;
