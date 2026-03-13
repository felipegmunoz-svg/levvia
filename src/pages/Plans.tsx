import { useNavigate } from "react-router-dom";
import { fireResults } from "@/data/onboarding";
import { Flame, Check, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import logoFull from "@/assets/logo_livvia_branco.png";

interface Plan {
  id: string;
  name: string;
  price: string;
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

const Plans = () => {
  const navigate = useNavigate();

  // Get fire result from localStorage
  const raw = localStorage.getItem("levvia_onboarding");
  const answers = raw ? JSON.parse(raw) : {};
  const painLevel = answers[8] as string | undefined;
  const fireResult = painLevel ? fireResults[painLevel] : null;
  const userName = (answers[2] as string) || "";

  const handleSelectPlan = (planId: string) => {
    localStorage.setItem("levvia_selected_plan", planId);
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background gradient-page flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex justify-center">
        <img src={logoFull} alt="Levvia" className="w-[120px] h-auto opacity-60" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8">
        {/* Fire Result Summary */}
        {fireResult && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card rounded-2xl p-5 mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <Flame size={24} strokeWidth={1.5} className={fireResult.colorClass} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Seu diagnóstico</p>
                <p className={`text-base font-medium ${fireResult.colorClass}`}>
                  {fireResult.level}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {userName ? `${userName}, b` : "B"}aseado nas suas respostas, preparamos um plano personalizado para ajudar você.
            </p>
          </motion.div>
        )}

        {/* Title */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-light text-foreground mb-1">
            Escolha seu plano
          </h1>
          <p className="text-sm text-muted-foreground">
            Comece sua jornada de cuidado hoje
          </p>
        </motion.div>

        {/* Plan Cards */}
        <div className="space-y-4 max-w-sm mx-auto">
          {plans.map((plan, i) => (
            <motion.button
              key={plan.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPlan(plan.id)}
              className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 ${
                plan.highlight
                  ? "border-secondary bg-secondary/10 shadow-lg shadow-secondary/10"
                  : "border-white/10 bg-white/[0.06] hover:border-secondary/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-foreground">{plan.name}</span>
                    {plan.badge && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        plan.highlight
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-accent/20 text-accent"
                      }`}>
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-semibold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.highlight ? "bg-secondary/20" : "bg-white/[0.06]"
                }`}>
                  {plan.highlight ? (
                    <Sparkles size={18} className="text-secondary" />
                  ) : (
                    <ArrowRight size={18} className="text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check size={14} className={plan.highlight ? "text-secondary" : "text-success"} strokeWidth={2.5} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;
