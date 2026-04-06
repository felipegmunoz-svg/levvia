import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";

const benefits = [
  "14 pílulas educativas — uma por dia",
  "Rotina diária personalizada para o seu fogo",
  "100 receitas anti-inflamatórias filtradas",
  "30 exercícios terapêuticos de baixo impacto",
  "Diário de sintomas com gráfico de evolução",
  "Relatório completo para o seu médico",
];

const Plans = () => {
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    localStorage.setItem("levvia_selected_plan", "challenge-14");
    navigate("/auth?mode=signup");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto px-6 pb-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center pt-10 pb-8"
        >
          <img src={logoIcon} alt="Levvia" className="w-12 h-12" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center max-w-[480px] mx-auto mb-8"
        >
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "hsl(214, 32%, 91%)",
              fontWeight: 400,
              lineHeight: 1.3,
            }}
          >
            Você sentiu o começo da transformação.
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "1rem",
              color: "rgba(237, 242, 247, 0.7)",
              lineHeight: 1.9,
            }}
          >
            Em 3 dias você entendeu o seu fogo, sentiu alívio e ganhou clareza nutricional.
            Imagine o que 14 dias completos farão pelo seu corpo.
          </p>
        </motion.div>

        {/* Divider */}
        <div className="max-w-[480px] mx-auto mb-8">
          <div style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />
        </div>

        {/* Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-[480px] mx-auto mb-6"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(46, 196, 182, 0.3)",
            borderRadius: 20,
            padding: 32,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Label */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              color: "hsl(174, 63%, 47%)",
              marginBottom: 8,
            }}
          >
            DESAFIO LEVVIA
          </p>

          {/* Plan Title */}
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "1.8rem",
              color: "hsl(214, 32%, 91%)",
              marginBottom: 8,
            }}
          >
            14 Dias de Transformação
          </h2>

          {/* Price */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "2.8rem",
              color: "hsl(214, 32%, 91%)",
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            R$ 29,90
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "0.85rem",
              color: "rgba(237, 242, 247, 0.5)",
              marginBottom: 20,
            }}
          >
            pagamento único · sem recorrência
          </p>

          {/* Inner divider */}
          <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 20 }} />

          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <span style={{ color: "hsl(174, 63%, 47%)", fontSize: "0.85rem", marginTop: 2, flexShrink: 0 }}>✦</span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem",
                    color: "rgba(237, 242, 247, 0.8)",
                    lineHeight: 1.5,
                  }}
                >
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-[480px] mx-auto"
        >
          <button
            onClick={handleSelectPlan}
            className="w-full flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1.05rem",
              padding: 18,
              background: "linear-gradient(135deg, hsl(174, 63%, 47%), hsl(196, 58%, 42%))",
              color: "hsl(210, 63%, 13%)",
              fontWeight: 600,
            }}
          >
            Começar meu Desafio de 14 Dias
            <ArrowRight size={18} />
          </button>

          <p
            className="text-center mt-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "0.85rem",
              color: "rgba(237, 242, 247, 0.5)",
              lineHeight: 1.6,
            }}
          >
            Pagamento único. Sem assinatura.
            <br />
            Sem renovação automática.
          </p>
        </motion.div>

        {/* Separator */}
        <div className="max-w-[480px] mx-auto flex items-center gap-4 my-6">
          <div className="flex-1" style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(140,160,180,0.5)" }}>ou</span>
          <div className="flex-1" style={{ height: 1, background: "rgba(0,0,0,0.06)" }} />
        </div>

        {/* Free link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <button
            onClick={() => navigate("/today")}
            className="bg-transparent border-none cursor-pointer transition-opacity hover:opacity-80"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "0.9rem",
              color: "hsl(210, 25%, 47%)",
            }}
          >
            Continuar explorando gratuitamente
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Plans;
