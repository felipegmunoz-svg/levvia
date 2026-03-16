import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Lock, ArrowLeft, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import logoFull from "@/assets/logo_livvia_branco.png";

const planDetails: Record<string, { name: string; price: string; period: string }> = {
  monthly: { name: "Mensal", price: "R$ 29,90", period: "/mês" },
  quarterly: { name: "Trimestral", price: "R$ 69,90", period: "/trimestre" },
  annual: { name: "Anual", price: "R$ 199,90", period: "/ano" },
};

const Checkout = () => {
  const navigate = useNavigate();
  const selectedPlanId = localStorage.getItem("levvia_selected_plan") || "monthly";
  const plan = planDetails[selectedPlanId] || planDetails.monthly;

  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Pagamento confirmado! 🎉",
        description: "Bem-vinda ao Levvia! Sua jornada começa agora.",
      });
      navigate("/today", { replace: true });
    }, 2000);
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-2xl border border-white/10 bg-white/[0.06] text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:border-secondary focus:outline-none transition-colors backdrop-blur-[10px]";

  return (
    <div className="min-h-screen bg-background gradient-page flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} strokeWidth={1.5} />
            <span className="text-xs font-medium">Voltar</span>
          </button>
          <img src={logoFull} alt="Levvia" className="w-[100px] h-auto opacity-60" />
          <div className="w-12" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-5">
        {/* Plan Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-2xl p-5"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Plano selecionado</p>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-medium text-foreground">{plan.name}</h2>
            <div className="text-right">
              <span className="text-2xl font-semibold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-success">
            <Check size={14} strokeWidth={2.5} />
            <span className="text-xs font-medium">7 dias grátis inclusos</span>
          </div>
        </motion.div>

        {/* Payment Form (Mockup) */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={18} className="text-secondary" />
            <h2 className="text-base font-medium text-foreground">Dados do Cartão</h2>
          </div>

          <div className="space-y-3">
            <input
              className={inputClass}
              placeholder="Nome no cartão"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              inputMode="numeric"
            />
            <div className="flex gap-3">
              <input
                className={inputClass}
                placeholder="MM/AA"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                inputMode="numeric"
              />
              <input
                className={inputClass}
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
              />
            </div>
          </div>
        </motion.div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Lock size={14} strokeWidth={1.5} />
          <span className="text-[11px]">Pagamento 100% seguro e criptografado</span>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-8">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePayment}
          disabled={loading}
          className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-4 rounded-3xl font-medium text-base gradient-primary text-foreground hover:opacity-90 transition-all disabled:opacity-60"
        >
          {loading ? "Processando..." : "Confirmar Pagamento"}
        </motion.button>
      </div>
    </div>
  );
};

export default Checkout;
