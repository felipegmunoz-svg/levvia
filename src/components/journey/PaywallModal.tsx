import { motion } from "framer-motion";
import logoAzul from "@/assets/logo_livvia_azul_icone.png";

interface PaywallModalProps {
  onClose?: () => void;
}

const CHECKOUT_URL = import.meta.env.VITE_CHECKOUT_URL || "#";

const upcomingDays = [
  { emoji: "🌙", day: 4, title: "O Sono que Cura", desc: "Aprenda a usar o descanso como ferramenta de desinflamação" },
  { emoji: "🏃‍♀️", day: 5, title: "Movimento Sem Dor", desc: "Desbloqueie o fluxo do seu corpo" },
  { emoji: "✨", day: 6, title: "O Poder das Especiarias", desc: "Seu shot de ouro contra a inflamação" },
  { emoji: "🏆", day: 7, title: "Sua Primeira Grande Vitória", desc: "Compare visualmente Dia 1 vs Dia 7" },
  { emoji: "📊", day: 14, title: "O Nascimento da Levve", desc: "Relatório Completo + Comunidade Exclusiva" },
];

const PaywallModal = ({ onClose }: PaywallModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center px-6 py-10">
        <motion.img
          src={logoAzul}
          alt="Levvia"
          className="w-14 h-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-foreground text-center mb-4 italic"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
          }}
        >
          Sua Jornada de Transformação Está Apenas Começando
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/60 text-center max-w-md mb-8 leading-relaxed"
          style={{ fontWeight: 300, fontSize: "0.9rem" }}
        >
          Nesses 3 dias, você já identificou seu fogo, sentiu o alívio físico e
          ganhou clareza nutricional. Você começou a sentir mudanças reais no seu
          corpo.
        </motion.p>

        {/* Upcoming days */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-5 max-w-md w-full mb-8"
        >
          <p className="text-secondary text-sm font-medium mb-4">
            O que você vai conquistar nos próximos 11 dias:
          </p>
          <div className="space-y-3">
            {upcomingDays.map((item) => (
              <div key={item.day} className="flex items-start gap-3">
                <span className="text-lg">{item.emoji}</span>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    Dia {item.day}: {item.title}
                  </p>
                  <p
                    className="text-foreground/50 text-xs"
                    style={{ fontWeight: 300 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <p className="text-foreground/50 text-sm mb-1">
            Investimento para jornada completa:
          </p>
          <p
            className="text-foreground font-medium"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
            }}
          >
            R$ 29,90
          </p>
          <p className="text-foreground/40 text-xs mt-1">
            Pagamento único • Acesso vitalício ao conteúdo
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="w-full max-w-xs space-y-3"
        >
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-3xl gradient-primary text-foreground font-medium text-sm text-center"
          >
            Continuar Minha Jornada de Leveza 💜
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="block w-full py-3 text-foreground/40 text-sm text-center hover:text-foreground/60 transition-colors"
            >
              Preciso pensar mais
            </button>
          )}
        </motion.div>

        {/* Guarantee */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-foreground/30 text-xs text-center mt-8 max-w-xs"
        >
          ✅ Seu progresso está salvo. Você pode continuar quando quiser.
        </motion.p>
      </div>
    </div>
  );
};

export default PaywallModal;
