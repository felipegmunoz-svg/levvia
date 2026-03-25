import { motion } from "framer-motion";

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

const fogoInternoScore = 65;

const Day5Dashboard = ({ movementData, onContinue }: Day5DashboardProps) => {
  const sensation = movementData.journalEntry?.legsSensation;
  const duration = movementData.legsElevationDuration ?? 5;

  const activities = [
    { emoji: "🌅", title: "Manhã: Exercícios Linfáticos", sub: "Elevação, Flexão e Rotação completadas" },
    { emoji: "🥗", title: `Almoço: ${getLunchName(movementData.lunchChoice || "")}`, sub: "Nutrição anti-inflamatória" },
    { emoji: "🥤", title: `Tarde: ${getSnackName(movementData.snackChoice || "")}`, sub: "Detox + Micro-desafio marcha" },
    { emoji: "🧘‍♀️", title: `Noite: Elevação de Pernas (${duration} min)`, sub: "Drenagem gravitacional" },
  ];

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
        <div className="glass-card p-5 mb-6">
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

        {/* Insight personalizado */}
        {sensation === "muito_mais_leves" && (
          <div className="glass-card p-5 mb-6 border border-green-500/20">
            <p className="text-foreground text-sm font-bold mb-2">🎉 Suas pernas estão muito mais leves!</p>
            <p className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              Isso não é coincidência — é resultado direto do movimento que você cultivou hoje.
              A bomba linfática que você ativou drenou o excesso de líquido. Você está provando
              para si mesma que movimento é medicina.
            </p>
          </div>
        )}
        {sensation === "um_pouco_mais_leves" && (
          <div className="glass-card p-5 mb-6 border border-blue-500/20">
            <p className="text-foreground text-sm font-bold mb-2">💙 Você sentiu melhora!</p>
            <p className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              Mesmo que sutil, "um pouco mais leve" é progresso real.
              A drenagem linfática é gradual — cada dia de movimento contribui
              para a redução da inflamação. Continue confiando no processo.
            </p>
          </div>
        )}
        {sensation === "iguais" && (
          <div className="glass-card p-5 mb-6 border border-amber-500/20">
            <p className="text-foreground text-sm font-bold mb-2">🌱 Progresso não é sempre linear</p>
            <p className="text-foreground/60 text-xs" style={{ fontWeight: 300, lineHeight: 1.7 }}>
              Dias sem mudança perceptível são normais — o corpo precisa de tempo
              para responder. O mais importante é que você manteve o compromisso
              com o movimento. A consistência é o que transforma, não a perfeição.
            </p>
          </div>
        )}
        {sensation === "mais_pesadas" && (
          <div className="glass-card p-5 mb-6 border border-purple-500/20">
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
        <div className="glass-card p-5 mb-6">
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
        <div className="glass-card p-4 mb-8 text-center">
          <p className="text-foreground/50 text-xs italic" style={{ fontWeight: 300, lineHeight: 1.7 }}>
            💜 <strong>Lavínia diz:</strong> Você provou hoje que o movimento
            é o melhor remédio. Amanhã, vamos potencializar isso com o
            Poder das Especiarias!
          </p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/5 z-10 md:relative md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
        <button
          onClick={onContinue}
          className="w-full max-w-xs mx-auto py-4 rounded-3xl font-medium text-sm block gradient-primary text-foreground transition-all"
        >
          Finalizar Dia 5 →
        </button>
      </div>
    </div>
  );
};

export default Day5Dashboard;
