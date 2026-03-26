import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
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
  1: "Dia 1: Consciência Corporal",
  2: "Dia 2: Hidratação Inteligente",
  3: "Dia 3: Semáforo Alimentar",
  4: "Dia 4: Movimento Consciente",
  5: "Dia 5: Ritmo Circadiano",
  6: "Dia 6: Integração Total",
};

const dayIcons: Record<number, string> = {
  1: "🔥",
  2: "💧",
  3: "🚦",
  4: "🧘‍♀️",
  5: "🌙",
  6: "✨",
};

const dayDescriptions: Record<number, string> = {
  1: "Você mapeou suas áreas de desconforto e começou a construir consciência corporal.",
  2: "Você identificou seus focos de inflamação e iniciou práticas de drenagem.",
  3: "Você aprendeu a classificar alimentos pelo seu potencial inflamatório.",
  4: "Você explorou movimentos conscientes e higiene do sono.",
  5: "Você trabalhou ritmo circadiano, elevação de pernas e micro-desafios.",
  6: "Você integrou todos os aprendizados em uma rotina completa.",
};

const DayReview = () => {
  const [searchParams] = useSearchParams();
  const dayNum = Number(searchParams.get("review"));
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.id || !dayNum) {
        setLoading(false);
        return;
      }
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

  if (!dayNum || dayNum < 1 || dayNum > 6) {
    navigate("/journey");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2EC4B6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedAt = data?.[`day${dayNum}_completed_at` as keyof ProfileData] as string | null;

  const renderHeatMap = () => {
    const heatMap = data?.heat_map_day1;
    if (!heatMap || typeof heatMap !== "object") return <p className="text-sm text-muted-foreground">Nenhum dado salvo.</p>;
    const entries = Object.entries(heatMap).filter(([, v]) => (v as number) > 0);
    if (entries.length === 0) return <p className="text-sm text-muted-foreground">Nenhuma área marcada.</p>;
    return (
      <div className="grid grid-cols-2 gap-2">
        {entries.map(([area, level]) => (
          <div key={area} className="bg-white border border-border rounded-lg p-3">
            <span className="text-sm font-medium capitalize">{area.replace(/_/g, " ")}</span>
            <div className="flex mt-1 gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= (level as number) ? "bg-red-400" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderInflammationMap = () => {
    const map = data?.day2_inflammation_map;
    if (!map || typeof map !== "object") return <p className="text-sm text-muted-foreground">Nenhum dado salvo.</p>;
    return <pre className="text-xs bg-white border border-border rounded-lg p-3 overflow-auto">{JSON.stringify(map, null, 2)}</pre>;
  };

  const renderSleepData = () => {
    const sleep = data?.day4_sleep_data;
    if (!sleep || typeof sleep !== "object") return <p className="text-sm text-muted-foreground">Nenhum dado salvo.</p>;
    return <pre className="text-xs bg-white border border-border rounded-lg p-3 overflow-auto">{JSON.stringify(sleep, null, 2)}</pre>;
  };

  const renderMovementData = () => {
    const movement = data?.day5_movement_data;
    if (!movement || typeof movement !== "object") return <p className="text-sm text-muted-foreground">Nenhum dado salvo.</p>;
    return <pre className="text-xs bg-white border border-border rounded-lg p-3 overflow-auto">{JSON.stringify(movement, null, 2)}</pre>;
  };

  const renderSpiceData = () => {
    const spice = data?.day6_spice_data;
    if (!spice || typeof spice !== "object") return <p className="text-sm text-muted-foreground">Nenhum dado salvo.</p>;
    return <pre className="text-xs bg-white border border-border rounded-lg p-3 overflow-auto">{JSON.stringify(spice, null, 2)}</pre>;
  };

  const renderDayContent = () => {
    switch (dayNum) {
      case 1:
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">🗺️ Seu Mapa de Calor</h3>
            {renderHeatMap()}
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">🔥 Mapa de Inflamação</h3>
            {renderInflammationMap()}
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">🚦 Semáforo Alimentar</h3>
            <p className="text-sm text-muted-foreground">Você aprendeu a classificar alimentos como verde, amarelo ou vermelho.</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">😴 Dados de Sono</h3>
            {renderSleepData()}
          </div>
        );
      case 5:
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">🏃 Dados de Movimento</h3>
            {renderMovementData()}
          </div>
        );
      case 6:
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">🌿 Temperos & Especiarias</h3>
            {renderSpiceData()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex justify-center">
          <img src={logoFull} alt="Levvia" className="h-10" />
        </div>
      </header>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Title card */}
        <div className="bg-white rounded-xl border border-border p-6 text-center space-y-3">
          <span className="text-4xl">{dayIcons[dayNum]}</span>
          <h1 className="text-xl font-bold text-foreground">{dayTitles[dayNum]}</h1>
          <p className="text-sm text-muted-foreground">{dayDescriptions[dayNum]}</p>
          {completedAt && (
            <p className="text-xs text-muted-foreground">
              Concluído em {new Date(completedAt).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>

        {/* Day-specific saved data */}
        <div className="bg-white rounded-xl border border-border p-6">
          {renderDayContent()}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate("/journey")}
          className="w-full py-3 bg-[#2EC4B6] text-white rounded-xl font-medium text-base hover:bg-[#28b0a3] transition-colors"
        >
          ← Voltar para Jornada
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default DayReview;
