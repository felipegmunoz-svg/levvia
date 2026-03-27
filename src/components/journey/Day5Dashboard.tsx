import { motion } from "framer-motion";
import HeatMapInteractive from "./HeatMapInteractive";

interface Day5DashboardProps {
  movementData: {
    lunchChoice?: string;
    snackChoice?: string;
    legsElevationDuration?: number;
    journalEntry?: {
      legsSensation: string;
      energyLevel: string;
      notes?: string;
    };
  };
  heatMapDay1?: Record<string, number> | null;
  onContinue: () => void;
}

const getLunchName = (choice: string) => {
  const names: Record<string, string> = {
    bowl_quinoa: "Bowl de Quinoa com Cúrcuma",
    salmao_legumes: "Salmão Grelhado com Legumes",
    frango_batata_doce: "Frango com Batata-Doce Assada",
  };
  return names[choice] || choice;
};

const getSnackName = (choice: string) => {
  const names: Record<string, string> = {
    smoothie_verde: "Smoothie Verde Detox",
    smoothie_tropical: "Smoothie Tropical Energético",
    smoothie_vermelho: "Smoothie Vermelho Antioxidante",
  };
  return names[choice] || choice;
};

const calculateImprovedMap = (
  originalMap: Record<string, number>,
  legsSensation?: string
): Record<string, number> => {
  const improvement =
    legsSensation === "muito_mais_leves" ? 2 :
    legsSensation === "um_pouco_mais_leves" ? 1 : 0;

  if (improvement === 0) return { ...originalMap };

  const improved = { ...originalMap };
  ["panturrilha_dir", "panturrilha_esq", "coxa_dir", "coxa_esq"].forEach((area) => {
    if (improved[area] && improved[area] > 0) {
      improved[area] = Math.max(0, improved[area] - improvement);
    }
  });
  return improved;
};

const fogoInternoScore = 65;

const journeyDays = [
  { day: 1, title: "Consciência Corporal", sub: "Mapeou seu Fogo Interno" },
  { day: 2, title: "Hidratação Inteligente", sub: "Sentiu alívio com drenagem linfática" },
  { day: 3, title: "Alimentação Anti-Inflamatória", sub: "Ganhou clareza nutricional" },
  { day: 4, title: "Força Suave e Estabilidade", sub: "Preparou ritual do sono restaurador" },
  { day: 5, title: "Movimento Sem Dor", sub: "Desbloqueou o fluxo linfático com movimento gentil" },
];

const Day5Dashboard = ({ movementData, heatMapDay1, onContinue }: Day5DashboardProps) => {
  const sensation = movementData.journalEntry?.legsSensation;
  const duration = movementData.legsElevationDuration ?? 5;

  const activities = [
    { emoji: "🌅", title: "Manhã: Exercícios Linfáticos", sub: "Elevação, Flexão e Rotação completadas" },
    { emoji: "🥗", title: `Almoço: ${getLunchName(movementData.lunchChoice || "")}`, sub: "Nutrição anti-inflamatória" },
    { emoji: "🥤", title: `Tarde: ${getSnackName(movementData.snackChoice || "")}`, sub: "Detox + Micro-desafio marcha" },
    { emoji: "🧘‍♀️", title: `Noite: Elevação de Pernas (${duration} min)`, sub: "Drenagem gravitacional" },
  ];

  const improvedMap = heatMapDay1
    ? calculateImprovedMap(heatMapDay1, sensation)
    : null;

  return (
    <div className="min-h-screen bg-background px-6 py-12 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-3 block">✨</span>
          <h2
            className="text-foreground mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}
          >
            Resumo do Seu Dia 5
          </h2>
          <p className="text-foreground/60 text-sm" style={{ fontWeight: 300, lineHeight: 1.7 }}>
            Veja tudo o que você conquistou hoje
          </p>
        </div>

        {/* Checklist */}
        <div className="levvia-card p-5 mb-6">
          <h3 className="text-foreground text-sm font-bold mb-4">Suas Atividades:</h3>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
                <span className="text-2xl">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{a.title}</p>
                  <p className="text-foreground/50 text-xs" style={{ fontWeight: 300 }}>{a.sub}</p>
                </div>
                <span className="text-green-500 font-bold text-sm shrink-0">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa de Calor Comparação */}
        {heatMapDay1 && (
          <div className="levvia-card p-5 mb-6">
            <h3 className="text-foreground text-sm font-bold mb-1">Veja Sua Evolução:</h3>
            <p className="text-foreground/50 text-xs mb-4" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              Compare como suas pernas estavam no Dia 1 vs Hoje (Dia 5)
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground/80 mb-2">Dia 1 (Início)</p>
                <HeatMapInteractive initialData={heatMapDay1} readOnly size="small" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground/80 mb-2">Hoje (Dia 5)</p>
                {improvedMap ? (
                  <HeatMapInteractive initialData={improvedMap} readOnly size="small" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-muted-foreground">Sem dados</p>
                  </div>
                )}
              </div>
            </div>

            {sensation === "muito_mais_leves" && (
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs text-foreground" style={{ fontWeight: 300, lineHeight: 1.7 }}>
                  🎉 <strong>Suas pernas estão "esfriando"!</strong> O movimento que você cultivou
                  nos últimos 5 dias está reduzindo a inflamação.
                </p>
              </div>
            )}
            {sensation === "um_pouco_mais_leves" && (
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-foreground" style={{ fontWeight: 300, lineHeight: 1.7 }}>
                  💙 <strong>Progresso visível!</strong> A redução de calor no mapa reflete
                  a melhora gradual que você está sentindo.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Timeline Progresso */}
        <div className="levvia-card p-5 mb-6">
          <h3 className="text-foreground text-sm font-bold mb-4">Sua Jornada até Aqui:</h3>
          <div className="space-y-3">
            {journeyDays.map((d) => (
              <div key={d.day} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    d.day < 5
                      ? "bg-green-500/20 text-green-400"
                      : "bg-secondary/20 text-secondary"
                  }`}
                >
                  {d.day < 5 ? "✓" : d.day}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">
                    Dia {d.day}: {d.title}
                  </p>
                  <p className="text-foreground/50 text-xs" style={{ fontWeight: 300 }}>{d.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-foreground/50 mb-2">
              <span>Progresso da Jornada</span>
              <span>5/14 dias (36%)</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                initial={{ width: 0 }}
                animate={{ width: "36%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Insight personalizado */}
        {sensation === "muito_mais_leves" && (
          <div className="levvia-card p-5 mb-6 border border-green-500/20">
            <p className="text-foreground text-sm font-bold mb-2">🎉 Suas pernas estão muito mais leves!</p>
            <p className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              Isso não é coincidência — é resultado direto do movimento que você cultivou hoje.
              A bomba linfática que você ativou drenou o excesso de líquido. Você está provando
              para si mesma que movimento é medicina.
            </p>
          </div>
        )}
        {sensation === "um_pouco_mais_leves" && (
          <div className="levvia-card p-5 mb-6 border border-blue-500/20">
            <p className="text-foreground text-sm font-bold mb-2">💙 Você sentiu melhora!</p>
            <p className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              Mesmo que sutil, "um pouco mais leve" é progresso real.
              A drenagem linfática é gradual — cada dia de movimento contribui
              para a redução da inflamação. Continue confiando no processo.
            </p>
          </div>
        )}
        {sensation === "iguais" && (
          <div className="levvia-card p-5 mb-6 border border-amber-500/20">
            <p className="text-foreground text-sm font-bold mb-2">🌱 Progresso não é sempre linear</p>
            <p className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              Dias sem mudança perceptível são normais — o corpo precisa de tempo
              para responder. O mais importante é que você manteve o compromisso
              com o movimento. A consistência é o que transforma, não a perfeição.
            </p>
          </div>
        )}
        {sensation === "mais_pesadas" && (
          <div className="levvia-card p-5 mb-6 border border-purple-500/20">
            <p className="text-foreground text-sm font-bold mb-2">💜 Validando sua experiência</p>
            <p className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              Dias difíceis acontecem. Pernas mais pesadas podem ser resultado
              de retenção hormonal, calor, ou até uma resposta inicial do corpo
              ao movimento. Isso não significa que você "falhou" — significa que
              você está sendo honesta consigo mesma. Continue cuidando com gentileza.
            </p>
          </div>
        )}

        {/* Fogo Interno */}
        <div className="levvia-card p-5 mb-6">
          <h3 className="text-foreground text-sm font-bold mb-1">Seu Fogo Interno:</h3>
          <p className="text-foreground/50 text-xs mb-4" style={{ fontWeight: 300, lineHeight: 1.7 }}>
            O "Fogo Interno" representa a inflamação crônica do Lipedema.
            Quanto mais baixo o número, melhor — significa que você está
            "apagando o incêndio" com autocuidado.
          </p>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🔥</span>
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: fogoInternoScore <= 50
                    ? "hsl(var(--secondary))"
                    : fogoInternoScore <= 70
                    ? "hsl(40, 90%, 50%)"
                    : "hsl(0, 80%, 55%)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${fogoInternoScore}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <span className="text-foreground text-sm font-bold whitespace-nowrap">
              {fogoInternoScore}/100
            </span>
          </div>

          <div className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
            {fogoInternoScore <= 50 && (
              <p>✨ <strong>Excelente!</strong> Seu fogo está controlado. Continue nutrindo e movendo seu corpo com gentileza.</p>
            )}
            {fogoInternoScore > 50 && fogoInternoScore <= 70 && (
              <p>🔥 <strong>Moderado.</strong> Você está no caminho certo. Cada dia de autocuidado reduz a inflamação um pouco mais.</p>
            )}
            {fogoInternoScore > 70 && (
              <p>🔥 <strong>Alto.</strong> Seu corpo está inflamado, mas você está tomando as rédeas. Movimento + nutrição + descanso = apagar o fogo gradualmente.</p>
            )}
          </div>
        </div>

        {/* Lavínia */}
        <div className="levvia-card p-4 mb-8 text-center">
          <p className="text-foreground/50 text-xs italic" style={{ fontWeight: 300, lineHeight: 1.7 }}>
            💜 <strong>Lavínia diz:</strong> Você provou hoje que o movimento
            é o melhor remédio. Amanhã, vamos potencializar isso com o
            Poder das Especiarias!
          </p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/30 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <button
          onClick={onContinue}
          className="w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm block bg-primary text-primary-foreground transition-all"
        >
          Finalizar Dia 5 →
        </button>
      </div>
    </div>
  );
};

export default Day5Dashboard;
