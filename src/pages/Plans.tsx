import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Sparkles, Clock, Shield, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoFull from "@/assets/logo_livvia_branco.png";
import { useState, useEffect } from "react";

interface Plan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
}

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Mensal",
    price: "R$ 29,90",
    period: "/mês",
    features: [
      "Plano alimentar personalizado",
      "Exercícios adaptados ao seu nível",
      "Checklist diário de hábitos",
      "Acompanhamento de progresso",
    ],
  },
  {
    id: "quarterly",
    name: "Trimestral",
    price: "R$ 69,90",
    originalPrice: "R$ 89,70",
    period: "/trimestre",
    highlight: true,
    badge: "Mais popular",
    features: [
      "Tudo do plano mensal",
      "Economia de 22%",
      "Receitas exclusivas",
      "Suporte prioritário",
    ],
  },
  {
    id: "annual",
    name: "Anual",
    price: "R$ 199,90",
    originalPrice: "R$ 358,80",
    period: "/ano",
    badge: "Melhor valor",
    features: [
      "Tudo do plano trimestral",
      "Economia de 44%",
      "Conteúdos antecipados",
      "Acesso vitalício a atualizações",
    ],
  },
];

const useCountdown = () => {
  const getEndTime = () => {
    const stored = localStorage.getItem("levvia_offer_end");
    if (stored) return parseInt(stored);
    // 24h from now
    const end = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("levvia_offer_end", end.toString());
    return end;
  };

  const [endTime] = useState(getEndTime);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: timeLeft <= 0 };
};

const CountdownDigit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-12 h-12 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="text-lg font-medium text-foreground tabular-nums"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
  </div>
);

const Plans = () => {
  const navigate = useNavigate();
  const { hours, minutes, seconds, expired } = useCountdown();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);


  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setTimeout(() => {
      localStorage.setItem("levvia_selected_plan", planId);
      navigate("/auth?mode=signup");
    }, 400);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 200, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen bg-background gradient-page flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-6 pt-6 pb-2 flex justify-center"
      >
        <img src={logoFull} alt="Levvia" className="w-[120px] h-auto opacity-60" />
      </motion.div>

      <div className="flex-1 overflow-y-auto px-6 pb-8">
        {/* Countdown Banner */}
        {!expired && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.25 }}
            className="rounded-2xl p-4 mb-5 border border-accent/20 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(36 90% 58% / 0.12), hsl(36 90% 58% / 0.04))",
            }}
          >
            {/* Subtle glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative flex items-center gap-3 mb-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap size={18} className="text-accent" fill="currentColor" />
              </motion.div>
              <p className="text-sm font-medium text-accent">
                Oferta especial — tempo limitado!
              </p>
            </div>

            <div className="relative flex items-center justify-center gap-3">
              <CountdownDigit value={hours} label="horas" />
              <span className="text-lg text-muted-foreground font-light mt-[-14px]">:</span>
              <CountdownDigit value={minutes} label="min" />
              <span className="text-lg text-muted-foreground font-light mt-[-14px]">:</span>
              <CountdownDigit value={seconds} label="seg" />
            </div>
          </motion.div>
        )}

        {/* Title */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl font-light text-foreground mb-1">
            Escolha seu plano
          </h1>
          <p className="text-sm text-muted-foreground">
            7 dias grátis • Cancele quando quiser
          </p>
        </motion.div>

        {/* Plan Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 max-w-sm mx-auto"
        >
          {plans.map((plan) => (
            <motion.button
              key={plan.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectPlan(plan.id)}
              className={`w-full text-left rounded-2xl border p-5 transition-colors duration-200 relative overflow-hidden ${
                selectedPlan === plan.id
                  ? "border-secondary bg-secondary/15 shadow-lg shadow-secondary/20"
                  : plan.highlight
                  ? "border-secondary/50 bg-secondary/10 shadow-lg shadow-secondary/10"
                  : "border-white/10 bg-white/[0.06] hover:border-secondary/30"
              }`}
            >
              {/* Highlight glow effect */}
              {plan.highlight && (
                <motion.div
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-secondary/10 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              )}

              <div className="relative flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-foreground">{plan.name}</span>
                    {plan.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          plan.highlight
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-accent/20 text-accent"
                        }`}
                      >
                        {plan.badge}
                      </motion.span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-semibold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                </div>
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.highlight ? "bg-secondary/20" : "bg-white/[0.06]"
                  }`}
                >
                  {plan.highlight ? (
                    <Sparkles size={18} className="text-secondary" />
                  ) : (
                    <ArrowRight size={18} className="text-muted-foreground" />
                  )}
                </motion.div>
              </div>
              <div className="relative space-y-2">
                {plan.features.map((feature, fi) => (
                  <motion.div
                    key={feature}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + fi * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={14} className={plan.highlight ? "text-secondary" : "text-success"} strokeWidth={2.5} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 mt-6 mb-4"
        >
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield size={14} strokeWidth={1.5} />
            <span className="text-[11px]">Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={14} strokeWidth={1.5} />
            <span className="text-[11px]">Cancele a qualquer momento</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Plans;
