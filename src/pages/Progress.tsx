import BottomNav from "@/components/BottomNav";
import ProgressCircle from "@/components/ui/ProgressCircle";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";

const evoData = [
  { day: "Dia 1", value: 80, color: "#EF4444" },
  { day: "Dia 2", value: 70, color: "#F59E0B" },
  { day: "Dia 3", value: 65, color: "#FCD34D" },
  { day: "Dia 4", value: 60, color: "#5EEAD4" },
  { day: "Dia 5", value: 55, color: "#2EC4B6" },
];

const Progress = () => {
  const fogoScore = 65;
  const fogoColor = fogoScore <= 40 ? "#10B981" : fogoScore <= 70 ? "#F59E0B" : "#EF4444";
  const fogoLabel = fogoScore <= 40 ? "Baixo" : fogoScore <= 70 ? "Moderado" : "Alto";
  const fogoMessage =
    fogoScore <= 40
      ? "Bom progresso! Sua inflamação está controlada."
      : fogoScore <= 70
      ? "Moderado — Você está no caminho certo. Cada dia de autocuidado reduz a inflamação."
      : "Precisa atenção — Continue a jornada, seu corpo responde a cada ação.";

  return (
    <div className="levvia-page min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src={logoIcon} alt="Levvia" className="h-7" />
        </div>
        <h1 className="text-[26px] font-heading font-semibold text-levvia-fg tracking-tight">
          Seu Progresso
        </h1>
        <p className="text-[13px] text-levvia-muted font-body mt-1">
          Acompanhe sua evolução
        </p>
      </header>

      <main className="px-5 space-y-5">
        {/* Fogo Interno */}
        <div className="levvia-card p-6">
          <h2 className="text-[14px] font-heading font-semibold text-levvia-fg mb-5">
            🔥 Fogo Interno
          </h2>
          <div className="flex justify-center mb-4">
            <ProgressCircle
              value={fogoScore}
              max={100}
              size="lg"
              color={fogoColor}
              label={fogoLabel}
            />
          </div>
          <p className="text-[13px] text-levvia-muted font-body text-center leading-relaxed">
            {fogoMessage}
          </p>

          {/* Legend */}
          <div className="mt-5 space-y-2">
            {[
              { color: "#10B981", range: "0-40", label: "Baixo (bom progresso)" },
              { color: "#F59E0B", range: "41-70", label: "Moderado (caminho certo)" },
              { color: "#EF4444", range: "71-100", label: "Alto (precisa atenção)" },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-[11px] text-levvia-muted font-body">
                  {item.range}: {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Evolução Mapa de Calor */}
        <div className="levvia-card p-6">
          <h2 className="text-[14px] font-heading font-semibold text-levvia-fg mb-5">
            📊 Evolução Mapa de Calor
          </h2>

          <div className="space-y-3">
            {evoData.map((item) => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-levvia-fg font-body w-12 shrink-0">
                  {item.day}:
                </span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
                <span className="text-[11px] text-levvia-muted font-body w-8 text-right">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-levvia-muted font-body">
            <span>🔥</span>
            <span>Fogo diminuindo</span>
            <span>→</span>
            <span>Inflamação reduzindo</span>
            <span>💧</span>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Progress;
