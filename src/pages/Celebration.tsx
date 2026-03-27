import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { useCelebrationData } from "@/hooks/useCelebrationData";
import { generateDossie } from "@/lib/generateDossie";
import HeatMapComparative from "@/components/journey/HeatMapComparative";
import BottomNav from "@/components/BottomNav";
import logoFull from "@/assets/logo_livvia_azul.png";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12 },
  }),
};

const Celebration = () => {
  const navigate = useNavigate();
  const {
    userName,
    totalLiters,
    totalMovementMinutes,
    day1Score,
    day14Score,
    lightnessScores,
    dayHistory,
    day1HeatMapData,
    loading,
  } = useCelebrationData();

  const [doctorMessage, setDoctorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const daysCompleted = dayHistory.filter((d) => d.nightDone).length;
  const scoreDiff =
    day1Score != null && day14Score != null ? day14Score - day1Score : null;

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await generateDossie({
        userName,
        totalLiters,
        totalMovementMinutes,
        day1Score,
        day14Score,
        lightnessScores,
        dayHistory,
        doctorMessage,
      });
      toast.success("Dossiê gerado com sucesso! Verifique seus downloads.");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="levvia-page min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-levvia-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-levvia-muted font-body">
            Preparando sua celebração...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="levvia-page min-h-screen pb-24">
      {/* ── BLOCO 1: Header ── */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="text-center pt-8 pb-6 px-6">
        <img src={logoFull} alt="Levvia" className="h-8 mx-auto mb-4" />
        <div className="text-5xl mb-3">🌊</div>
        <h1 className="font-heading font-bold text-2xl text-levvia-fg mb-2">
          Você completou sua Jornada!
        </h1>
        <p className="text-sm text-levvia-muted font-body">
          14 dias de cuidado, movimento e leveza.
        </p>
      </motion.div>

      <div className="px-4 space-y-5 max-w-lg mx-auto">
        {/* ── BLOCO 2: Mensagem da Lavínia ── */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
          <div className="levvia-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="font-heading font-semibold text-levvia-fg text-sm">
                Lavínia
              </span>
            </div>
            <p className="text-[13px] text-levvia-fg/80 font-body leading-relaxed italic">
              "Olhe para onde você começou e sinta a leveza que você conquistou.
              Você não apenas seguiu um roteiro; você agora tem alguém que caminha
              ao seu lado. Eu, a Lavínia, estive com você em cada copo d'água e em
              cada movimento, e juntas resgatamos o comando do seu corpo. Esta
              vitória é nossa!"
            </p>
          </div>
        </motion.div>

        {/* ── BLOCO 3: Dashboard de Vitória ── */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
          <h2 className="font-heading font-semibold text-lg text-levvia-fg mb-3">
            Suas Conquistas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Hidratação */}
            <div className="levvia-card p-4 text-center space-y-1">
              <div className="text-2xl">💧</div>
              <p className="font-heading font-bold text-xl text-levvia-primary">
                {totalLiters}L
              </p>
              <p className="text-xs text-levvia-muted font-body">
                de água ingerida
              </p>
              {totalLiters > 0 && (
                <p className="text-[10px] text-levvia-muted/70 font-body">
                  ≈ {Math.round(totalLiters / 2)} reposições completas
                </p>
              )}
            </div>

            {/* Movimento */}
            <div className="levvia-card p-4 text-center space-y-1">
              <div className="text-2xl">🏃‍♀️</div>
              <p className="font-heading font-bold text-xl text-levvia-primary">
                {totalMovementMinutes}min
              </p>
              <p className="text-xs text-levvia-muted font-body">
                de movimento linfático
              </p>
            </div>

            {/* Evolução da leveza */}
            <div className="levvia-card p-4 text-center space-y-1">
              <div className="text-2xl">📈</div>
              <p className="font-heading font-bold text-xl text-levvia-primary">
                {day1Score ?? "—"} → {day14Score ?? "—"}
              </p>
              <p className="text-xs text-levvia-muted font-body">
                evolução da leveza
              </p>
              {scoreDiff != null && scoreDiff > 0 && (
                <p className="text-[10px] text-levvia-success font-body font-medium">
                  ↑ {scoreDiff} pontos de melhora
                </p>
              )}
            </div>

            {/* Aderência */}
            <div className="levvia-card p-4 text-center space-y-1">
              <div className="text-2xl">✅</div>
              <p className="font-heading font-bold text-xl text-levvia-primary">
                {daysCompleted}/14
              </p>
              <p className="text-xs text-levvia-muted font-body">
                dias concluídos
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── BLOCO 4: Heatmap Comparativo ── */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
          <h2 className="font-heading font-semibold text-lg text-levvia-fg mb-3">
            Sua Transformação Visual
          </h2>
          {day1HeatMapData ? (
            <HeatMapComparative
              day1Data={day1HeatMapData}
              onNext={() => {}}
              isReviewMode={true}
            />
          ) : (
            <div className="levvia-card p-6 text-center">
              <p className="text-sm text-levvia-muted font-body">
                Mapa corporal não disponível para comparação.
              </p>
            </div>
          )}
        </motion.div>

        {/* ── BLOCO 5: Gerador do Dossiê ── */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
          <div className="levvia-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📄</span>
              <h2 className="font-heading font-semibold text-base text-levvia-fg">
                Dossiê de Autocuidado
              </h2>
            </div>
            <p className="text-[13px] text-levvia-muted font-body leading-relaxed">
              Gere um PDF personalizado com todo o histórico da sua jornada —
              pronto para compartilhar com seu médico ou especialista.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-medium text-levvia-fg font-body">
                Mensagem para seu médico{" "}
                <span className="text-levvia-muted font-normal">(opcional)</span>
              </label>
              <textarea
                value={doctorMessage}
                onChange={(e) => setDoctorMessage(e.target.value)}
                placeholder='Ex: "Minha dor no tornozelo diminuiu 80% após os exercícios de drenagem. Os edemas nas pernas reduziram visivelmente."'
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-levvia-border bg-white text-[13px] font-body text-levvia-fg placeholder:text-levvia-muted/60 focus:border-levvia-primary focus:outline-none resize-none"
              />
            </div>
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-levvia-primary text-white font-medium text-[13px] font-body flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
            >
              <Download size={15} />
              {isGenerating ? "Gerando PDF..." : "Gerar meu Dossiê PDF"}
            </button>
          </div>
        </motion.div>

        {/* ── BLOCO 6: CTA Plano Anual ── */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-levvia-border" />
            <span className="text-[11px] text-levvia-muted font-body tracking-wider">
              ✦ Plano Anual da Leveza ✦
            </span>
            <div className="flex-1 h-px bg-levvia-border" />
          </div>

          <div className="levvia-card p-6 bg-gradient-to-br from-levvia-primary/5 to-levvia-secondary/10 border border-levvia-primary/20 space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-3">🌿</div>
              <h2 className="font-heading font-semibold text-xl text-levvia-fg mb-2">
                Continue sua jornada
              </h2>
              <p className="text-[13px] text-levvia-muted font-body italic leading-relaxed">
                "A leveza que você construiu precisa de manutenção. Com o Plano
                Anual da Leveza, tenho receitas sazonais, novos rituais e
                acompanhamento contínuo para o ano inteiro."
              </p>
            </div>

            <ul className="space-y-2">
              {[
                "Receitas sazonais anti-inflamatórias",
                "Novos rituais a cada bimestre",
                "Técnicas avançadas de drenagem linfática",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[13px] text-levvia-fg font-body"
                >
                  <span className="text-levvia-primary mt-0.5">✦</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/plans")}
              className="w-full py-4 rounded-xl bg-levvia-primary text-white font-semibold text-sm font-body transition-opacity hover:opacity-90"
            >
              Quero meu Plano Anual da Leveza
            </button>
            <p className="text-xs text-levvia-muted text-center font-body">
              Invista em você. A leveza é um estilo de vida.
            </p>
          </div>
        </motion.div>

        {/* ── BLOCO 7: Rodapé ── */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center py-4"
        >
          <p className="text-sm text-levvia-muted font-body">
            Obrigada por confiar na Levvia para cuidar de você. 💙
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Celebration;
