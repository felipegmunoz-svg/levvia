import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { saveWithRetry } from "@/lib/saveWithRetry";
import DayTemplate from "@/components/journey/DayTemplate";
import ActivityCard from "@/components/journey/ActivityCard";
import type { DiaryData } from "@/components/journey/DiaryReflection";

interface Day6FlowProps {
  onComplete: () => void;
}

const Day6Flow = ({ onComplete }: Day6FlowProps) => {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);

  const toggle = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activities = [
    { id: "cha_curcuma", label: "Chá de Cúrcuma com Pimenta", icon: "☕", description: "Receita guiada anti-inflamatória", duration: "10 min" },
    { id: "temperos_verdes", label: "Conhecer Especiarias Verdes", icon: "🌿", description: "Gengibre, canela, açafrão", duration: "5 min" },
    { id: "automassagem", label: "Automassagem com Óleos", icon: "💆", description: "Técnica drenagem com especiarias", duration: "15 min" },
    { id: "jantar_anti", label: "Jantar Anti-Inflamatório", icon: "🍽️", description: "Receita com especiarias do dia", duration: "30 min" },
  ];

  const handleComplete = async () => {
    if (user?.id) {
      const spiceData = {
        activitiesCompleted: completed,
        diaryData,
        completedAt: new Date().toISOString(),
      };

      await saveWithRetry({
        userId: user.id,
        data: {
          day6_completed: true,
          day6_completed_at: new Date().toISOString(),
          day6_spice_data: spiceData,
        },
      });
    }
    onComplete();
  };

  const contentNode = (
    <div className="space-y-6">
      {/* Manhã */}
      <div>
        <p className="text-[11px] font-medium text-levvia-muted uppercase tracking-wider font-body mb-3">
          ☀️ Manhã — Despertar Anti-Inflamatório
        </p>
        <div className="space-y-2">
          <ActivityCard
            icon="☕"
            title="Chá de Cúrcuma com Pimenta-do-Reino"
            description="1 col. chá cúrcuma + pitada de pimenta-do-reino + mel"
            duration="10 min"
            completed={!!completed.cha_curcuma}
            onToggle={() => toggle("cha_curcuma")}
          />
          <div className="levvia-card p-4">
            <p className="text-[12px] text-levvia-fg font-body leading-relaxed">
              💡 <strong>Por que pimenta-do-reino?</strong> A piperina aumenta em até 2000% a absorção da curcumina.
              Juntas, são uma das combinações anti-inflamatórias mais potentes da natureza.
            </p>
          </div>
        </div>
      </div>

      {/* Tarde */}
      <div>
        <p className="text-[11px] font-medium text-levvia-muted uppercase tracking-wider font-body mb-3">
          🌤️ Tarde — Conhecimento & Prática
        </p>
        <div className="space-y-2">
          <ActivityCard
            icon="🌿"
            title="Especiarias Verdes: Seu Kit Anti-Inflamatório"
            description="Gengibre, canela, açafrão — conheça os benefícios"
            duration="5 min"
            completed={!!completed.temperos_verdes}
            onToggle={() => toggle("temperos_verdes")}
          />
          <div className="levvia-card p-4 space-y-3">
            <p className="text-[13px] font-medium text-levvia-fg font-body">🌶️ Guia Rápido:</p>
            {[
              { name: "Cúrcuma", benefit: "Anti-inflamatório potente (curcumina)" },
              { name: "Gengibre", benefit: "Reduz inchaço e melhora circulação" },
              { name: "Canela", benefit: "Regula açúcar e reduz inflamação" },
              { name: "Pimenta Caiena", benefit: "Ativa metabolismo e circulação" },
            ].map((spice) => (
              <div key={spice.name} className="flex items-start gap-2">
                <span className="text-levvia-primary text-xs mt-0.5">•</span>
                <div>
                  <span className="text-[13px] font-medium text-levvia-fg font-body">
                    {spice.name}:
                  </span>{" "}
                  <span className="text-[12px] text-levvia-muted font-body">
                    {spice.benefit}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <ActivityCard
            icon="💆"
            title="Automassagem com Óleos Essenciais"
            description="Técnica de drenagem suave com gengibre"
            duration="15 min"
            completed={!!completed.automassagem}
            onToggle={() => toggle("automassagem")}
          />
          <div className="levvia-card p-4">
            <p className="text-[13px] font-medium text-levvia-fg font-body mb-2">
              Técnica Guiada:
            </p>
            <ol className="space-y-1.5">
              {[
                "Aqueça 2 gotas de óleo de gengibre nas mãos",
                "Comece pelos tornozelos com movimentos ascendentes",
                "Suba lentamente pelas panturrilhas (pressão leve)",
                "Circule os joelhos com movimentos suaves",
                "Finalize nas coxas, sempre em direção ao coração",
              ].map((step, i) => (
                <li key={i} className="text-[12px] text-levvia-muted font-body flex gap-2">
                  <span className="text-levvia-primary font-medium shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Noite */}
      <div>
        <p className="text-[11px] font-medium text-levvia-muted uppercase tracking-wider font-body mb-3">
          🌙 Noite — Jantar Anti-Inflamatório
        </p>
        <div className="space-y-2">
          <ActivityCard
            icon="🍽️"
            title="Jantar com Especiarias do Dia"
            description="Escolha uma receita e use pelo menos 2 especiarias"
            duration="30 min"
            completed={!!completed.jantar_anti}
            onToggle={() => toggle("jantar_anti")}
          />
          <div className="levvia-card p-4">
            <p className="text-[12px] text-levvia-fg font-body leading-relaxed">
              💜 <em>Cozinhar com especiarias é um ato de autocuidado. Cada pitada de cúrcuma
              é uma declaração de amor ao seu corpo.</em> — Lavínia
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DayTemplate
      dayNumber={6}
      title="O Poder das Especiarias"
      affirmation="Cada tempero é uma medicina natural que meu corpo merece."
      objectives={[
        "Descobrir especiarias anti-inflamatórias",
        "Preparar chá medicinal de cúrcuma",
        "Aprender automassagem com óleos",
        "Incluir especiarias no jantar",
      ]}
      content={contentNode}
      closingMessage="Você descobriu o poder das especiarias! 🌶️"
      nextDayTeaser="Dia 7: Hidratação Profunda — A água como aliada contra o Lipedema"
      activities={activities.map((a) => ({
        label: a.label,
        completed: !!completed[a.id],
      }))}
      onComplete={handleComplete}
      onDiarySave={(data) => setDiaryData(data)}
    />
  );
};

export default Day6Flow;
