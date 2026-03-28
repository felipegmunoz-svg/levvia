import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { fireResults } from "@/data/onboarding";
import HeatMapInteractive from "@/components/journey/HeatMapInteractive";
import { motion } from "framer-motion";
import {
  Flame, Heart, Activity, Target, ShieldAlert, MapPin,
  UtensilsCrossed, ArrowRight, Sparkles, TrendingUp,
} from "lucide-react";
import logoFull from "@/assets/logo_livvia_azul.png";

const Diagnosis = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  const userName = profile.name || "Você";
  const age = profile.age ? String(profile.age) : "";
  const sex = profile.sex || "";
  const weightKg = profile.weightKg || 0;
  const heightCm = profile.heightCm || 0;
  const activityLevel = profile.activityLevel || "";
  const healthConditions = profile.healthConditions || [];
  const painLevel = profile.painLevel || "";
  const affectedAreas = profile.affectedAreas || [];
  const enemies = profile.inflammatoryEnemies || [];
  const allies = profile.antiInflammatoryAllies || [];
  const objectives = profile.objectives || [];
  const restrictions = profile.dietaryRestrictions || [];
  const heatMapDay1 = profile.heatMapDay1 || {};

  const fireResult = painLevel ? fireResults[painLevel] : null;

  const heatMapAreaLabels: Record<string, string> = {
    panturrilha_esq: "Panturrilha Esquerda",
    panturrilha_dir: "Panturrilha Direita",
    coxa_esq: "Coxa Esquerda",
    coxa_dir: "Coxa Direita",
    quadril_esq: "Quadril Esquerdo",
    quadril_dir: "Quadril Direito",
    abdomen: "Abdômen/Barriga",
    braco_esq: "Braço Esquerdo",
    braco_dir: "Braço Direito",
  };

  const heatMapEntries = Object.entries(heatMapDay1)
    .filter(([key, value]) => key !== "created_at" && typeof value === "number" && value > 0)
    .map(([key, value]) => ({
      key,
      area: heatMapAreaLabels[key] || key,
      intensity: value,
      emoji: value >= 3 ? "🔥🔥🔥" : value >= 2 ? "🔥🔥" : "🔥",
      description: value >= 3 ? "Alta intensidade" : value >= 2 ? "Intensidade moderada" : "Intensidade leve",
    }))
    .sort((a, b) => b.intensity - a.intensity);


  const persuasiveText = () => {
    const level = fireResult?.level || "Brisa Leve";
    if (level === "Brisa Leve") {
      return `${userName}, seu corpo está em bom equilíbrio! O Levvia vai te ajudar a manter esse estado com práticas anti-inflamatórias, alimentação estratégica e exercícios adaptados. Prevenir é o melhor caminho.`;
    }
    if (level === "Chamas Moderadas") {
      return `${userName}, seu corpo está enviando sinais leves de inflamação. Com o plano personalizado do Levvia — alimentação anti-inflamatória, exercícios adaptados e hábitos diários — você pode controlar esses sinais antes que se intensifiquem.`;
    }
    if (level === "Incêndio Crescente") {
      return `${userName}, a inflamação está presente e merece atenção. O Levvia foi feito para pessoas como você: com um plano completo de alimentação, movimento e autocuidado, vamos trabalhar juntas para reduzir o desconforto e devolver qualidade de vida.`;
    }
    return `${userName}, seu corpo precisa de atenção especial — e você merece esse cuidado. O Levvia vai te guiar com práticas gentis, alimentação anti-inflamatória e exercícios seguros para aliviar a dor e melhorar seu bem-estar dia após dia.`;
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.12, type: "spring" as const, stiffness: 200, damping: 20 },
    }),
  };

  return (
    <div className="theme-light min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 pt-6 pb-6 flex justify-center"
      >
        <img src={logoFull} alt="Levvia" className="w-[120px] h-auto opacity-60" />
      </motion.div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4">
        {/* Greeting */}
        <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
          <h1 className="text-2xl font-light text-foreground text-center mb-1">
            Seu Perfil Levvia, {userName}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Análise personalizada baseada nas suas respostas
          </p>
        </motion.div>

        {/* Fire Result Card */}
        {fireResult && (
          <motion.div
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="levvia-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center"
              >
                <Flame size={28} strokeWidth={1.5} className={fireResult.colorClass} />
              </motion.div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Fogo Interno</p>
                <p className={`text-lg font-medium ${fireResult.colorClass}`}>{fireResult.level}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{fireResult.description}</p>
          </motion.div>
        )}

        {heatMapEntries.length > 0 && (
          <motion.div
            custom={2}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="levvia-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-accent" />
              <h2 className="text-base font-medium text-foreground">Seu Perfil de Inflamação</h2>
            </div>

            <div className="rounded-2xl bg-muted border border-border mb-4">
              <HeatMapInteractive initialData={heatMapDay1} readOnly size="small" />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Áreas mais afetadas</p>
              {heatMapEntries.map((item) => (
                <div key={item.key} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3">
                  <span className="text-sm font-medium min-w-14">{item.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.area}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-foreground/70 mt-4">Estas são as áreas que você identificou com mais atenção em seu corpo. Acompanhe a evolução delas em sua jornada de leveza.</p>
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          custom={3}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="levvia-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart size={18} className="text-secondary" />
            <h2 className="text-base font-medium text-foreground">Seu Perfil</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {age && (
              <div className="bg-muted rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Idade</p>
                <p className="text-sm font-medium text-foreground">{age} anos</p>
              </div>
            )}
            {sex && (
              <div className="bg-muted rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sexo</p>
                <p className="text-sm font-medium text-foreground">{sex}</p>
              </div>
            )}
            {weightKg > 0 && (
              <div className="bg-muted rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Peso</p>
                <p className="text-sm font-medium text-foreground">{weightKg} kg</p>
              </div>
            )}
            {heightCm > 0 && (
              <div className="bg-muted rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Altura</p>
                <p className="text-sm font-medium text-foreground">{heightCm} cm</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Activity Level */}
        {activityLevel && (
          <motion.div
            custom={4}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="levvia-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-success" />
              <h2 className="text-base font-medium text-foreground">Nível de Atividade</h2>
            </div>
            <p className="text-sm text-foreground/80">{activityLevel}</p>
          </motion.div>
        )}

        {/* Affected Areas & Health Conditions */}
        {(affectedAreas.length > 0 || healthConditions.length > 0) && (
          <motion.div
            custom={5}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="levvia-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={18} className="text-accent" />
              <h2 className="text-base font-medium text-foreground">Áreas de Atenção</h2>
            </div>
            {affectedAreas.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={14} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Áreas afetadas</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {affectedAreas.map((area) => (
                    <span key={area} className="text-xs px-3 py-1.5 rounded-full bg-accent/15 text-accent font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {healthConditions.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Condições de saúde</p>
                <div className="flex flex-wrap gap-2">
                  {healthConditions.map((c) => (
                    <span key={c} className="text-xs px-3 py-1.5 rounded-full bg-destructive/15 text-destructive font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Objectives */}
        {objectives.length > 0 && (
          <motion.div
            custom={6}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="levvia-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-secondary" />
              <h2 className="text-base font-medium text-foreground">Seus Objetivos</h2>
            </div>
            <p className="text-sm text-foreground/80">{objectives.join(", ")}</p>
          </motion.div>
        )}

        {/* Dietary Info */}
        {(enemies.length > 0 || allies.length > 0 || restrictions.length > 0) && (
          <motion.div
            custom={7}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="levvia-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <UtensilsCrossed size={18} className="text-success" />
              <h2 className="text-base font-medium text-foreground">Perfil Alimentar</h2>
            </div>
            {enemies.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">⚠️ Inimigos inflamatórios</p>
                <div className="flex flex-wrap gap-1.5">
                  {enemies.map((e) => (
                    <span key={e} className="text-[11px] px-2.5 py-1 rounded-full bg-destructive/10 text-destructive/80">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {allies.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">✅ Aliados que você já usa</p>
                <div className="flex flex-wrap gap-1.5">
                  {allies.map((a) => (
                    <span key={a} className="text-[11px] px-2.5 py-1 rounded-full bg-success/10 text-success">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {restrictions.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Restrições alimentares</p>
                <div className="flex flex-wrap gap-1.5">
                  {restrictions.map((r) => (
                    <span key={r} className="text-[11px] px-2.5 py-1 rounded-full bg-muted text-foreground/70">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Persuasive CTA Section */}
        <motion.div
          custom={8}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl p-5 border border-secondary/30 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(174 63% 47% / 0.08), hsl(196 58% 42% / 0.12))",
          }}
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-secondary" />
              <h2 className="text-base font-medium text-foreground">O Levvia é para você</h2>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              {persuasiveText()}
            </p>
            <div className="space-y-2 mb-1">
              {[
                "Plano alimentar anti-inflamatório personalizado",
                "Exercícios adaptados ao seu nível de dor",
                "Checklist diário de hábitos saudáveis",
                "Acompanhamento do seu progresso",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles size={12} className="text-secondary flex-shrink-0" />
                  <span className="text-sm text-foreground/70">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-8">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(user ? "/today" : "/auth")}
          className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-4 rounded-3xl font-medium text-base bg-primary text-primary-foreground hover:opacity-90 transition-all"
        >
          Continuar
          <ArrowRight size={18} strokeWidth={1.5} />
        </motion.button>
      </div>
    </div>
  );
};

export default Diagnosis;
