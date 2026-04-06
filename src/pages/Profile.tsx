import { useState, useEffect, useMemo } from "react";
import FlowSilhouette from "@/components/FlowSilhouette";
import NotificationSettings from "@/components/NotificationSettings";
import { useNavigate } from "react-router-dom";
import EditProfileDialog from "@/components/EditProfileDialog";
import AvatarUpload from "@/components/AvatarUpload";
import {
  Settings,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Trophy,
  Bell,
  FileText,
  Shield,
  LogOut,
  User,
  Ruler,
  Activity,
  Heart,
  Stethoscope,
  Target,
  Flame,
  Calendar,
  CheckCircle2,
  Droplets,
  Dumbbell,
  UtensilsCrossed,
  Lock,
  Star,
  Zap,
  Pencil,
  ShoppingCart,
  Map,
} from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import logoIcon from "@/assets/logo_livvia_azul_icone.png";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// ─── Achievement definitions ───
interface Achievement {
  id: string;
  emoji: string;
  label: string;
  desc: string;
  check: (progress: Record<string, Record<string, boolean>>) => boolean;
}

const achievements: Achievement[] = [
  {
    id: "first_step",
    emoji: "🌱",
    label: "Primeiro Passo",
    desc: "Completou o onboarding",
    check: () => true, // If they're on Profile, they completed onboarding
  },
  {
    id: "day1_complete",
    emoji: "⭐",
    label: "Dia Perfeito",
    desc: "Complete um dia 100%",
    check: (p) => Object.values(p).some((day) => {
      const vals = Object.values(day);
      return vals.length > 0 && vals.every(Boolean);
    }),
  },
  {
    id: "streak_3",
    emoji: "🔥",
    label: "Fogo Aceso",
    desc: "3 dias seguidos completos",
    check: (p) => getMaxStreak(p) >= 3,
  },
  {
    id: "streak_7",
    emoji: "💎",
    label: "Uma Semana!",
    desc: "7 dias seguidos completos",
    check: (p) => getMaxStreak(p) >= 7,
  },
  {
    id: "halfway",
    emoji: "🏔️",
    label: "Metade do Caminho",
    desc: "Chegou ao dia 7",
    check: (p) => Object.keys(p).some((k) => parseInt(k) >= 7),
  },
  {
    id: "five_days",
    emoji: "🏃‍♀️",
    label: "Em Movimento",
    desc: "Complete 5 dias no total",
    check: (p) => getCompletedDayCount(p) >= 5,
  },
  {
    id: "ten_days",
    emoji: "🦋",
    label: "Transformação",
    desc: "Complete 10 dias no total",
    check: (p) => getCompletedDayCount(p) >= 10,
  },
  {
    id: "challenge_done",
    emoji: "👑",
    label: "Desafio Completo",
    desc: "Complete os 14 dias!",
    check: (p) => getCompletedDayCount(p) >= 14,
  },
  {
    id: "consistent",
    emoji: "💪",
    label: "Consistente",
    desc: "Média acima de 80%",
    check: (p) => {
      const days = Object.values(p);
      if (days.length < 3) return false;
      const avg = days.reduce((sum, day) => {
        const vals = Object.values(day);
        return sum + (vals.length > 0 ? vals.filter(Boolean).length / vals.length : 0);
      }, 0) / days.length;
      return avg >= 0.8;
    },
  },
];

function getMaxStreak(progress: Record<string, Record<string, boolean>>): number {
  let maxStreak = 0;
  let current = 0;
  for (let d = 1; d <= 14; d++) {
    const day = progress[d];
    if (day) {
      const vals = Object.values(day);
      if (vals.length > 0 && vals.every(Boolean)) {
        current++;
        maxStreak = Math.max(maxStreak, current);
      } else {
        current = 0;
      }
    } else {
      current = 0;
    }
  }
  return maxStreak;
}

function getCompletedDayCount(progress: Record<string, Record<string, boolean>>): number {
  return Object.values(progress).filter((day) => {
    const vals = Object.values(day);
    return vals.length > 0 && vals.every(Boolean);
  }).length;
}

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading, refresh } = useProfile();
  const { signOut, user } = useAuth();
  const [activeSection, setActiveSection] = useState<"info" | "evolution" | "achievements" | "settings">("info");
  const [challengeProgress, setChallengeProgress] = useState<Record<string, Record<string, boolean>>>({});
  const [editOpen, setEditOpen] = useState(false);

  // Load progress
  useEffect(() => {
    const load = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("challenge_progress")
          .eq("id", user.id)
          .single();
        if (data?.challenge_progress && typeof data.challenge_progress === "object") {
          setChallengeProgress(data.challenge_progress as Record<string, Record<string, boolean>>);
        }
      } else {
        const saved = localStorage.getItem("levvia_challenge_progress");
        if (saved) setChallengeProgress(JSON.parse(saved));
      }
    };
    load();
  }, [user?.id]);

  // Evolution data
  const evolutionData = useMemo(() => {
    const days: { day: number; percent: number; completed: number; total: number }[] = [];
    for (let d = 1; d <= 14; d++) {
      const dayData = challengeProgress[d];
      if (dayData) {
        const vals = Object.values(dayData);
        const total = vals.length;
        const completed = vals.filter(Boolean).length;
        days.push({ day: d, percent: total > 0 ? Math.round((completed / total) * 100) : 0, completed, total });
      }
    }
    return days;
  }, [challengeProgress]);

  const daysCompleted = getCompletedDayCount(challengeProgress);
  const maxStreak = getMaxStreak(challengeProgress);
  const avgCompletion = useMemo(() => {
    if (evolutionData.length === 0) return 0;
    return Math.round(evolutionData.reduce((s, d) => s + d.percent, 0) / evolutionData.length);
  }, [evolutionData]);

  // Achievements
  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.check(challengeProgress)),
    [challengeProgress]
  );

  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const resetChecklist = async () => {
    localStorage.removeItem("levvia_challenge_progress");
    if (user) {
      await supabase.from("profiles").update({ challenge_progress: {} }).eq("id", user.id);
    }
    toast({ title: "Checklist resetado", description: "Seu progresso de hoje foi reiniciado." });
    window.location.reload();
  };

  const resetOnboarding = async () => {
    localStorage.removeItem("levvia_onboarded");
    localStorage.removeItem("levvia_onboarding");
    localStorage.removeItem("levvia_checklist");
    localStorage.removeItem("levvia_challenge_start");
    localStorage.removeItem("levvia_challenge_progress");
    localStorage.removeItem("levvia_welcome_dismissed");
    localStorage.removeItem("levvia_meal_plan");
    if (user) {
      await supabase.from("profiles").update({
        onboarding_data: {},
        challenge_progress: {},
        challenge_start: null,
        pain_level: "",
        objectives: [],
        affected_areas: [],
        age: null,
        sex: "",
        weight_kg: null,
        height_cm: null,
        activity_level: "",
        health_conditions: [],
        pantry_items: [],
      }).eq("id", user.id);
    }
    window.location.href = "/onboarding";
  };

  const bmi = profile.weightKg && profile.heightCm
    ? (profile.weightKg / ((profile.heightCm / 100) ** 2)).toFixed(1)
    : null;

  const profileItems = [
    { icon: User, label: "Nome", value: profile.name || "—" },
    { icon: User, label: "Idade", value: profile.age ? `${profile.age} anos` : "—" },
    { icon: User, label: "Sexo", value: profile.sex || "—" },
    { icon: Ruler, label: "Peso", value: profile.weightKg ? `${profile.weightKg} kg` : "—" },
    { icon: Ruler, label: "Altura", value: profile.heightCm ? `${profile.heightCm} cm` : "—" },
    { icon: Ruler, label: "IMC", value: bmi ? `${bmi}` : "—" },
    { icon: Activity, label: "Nível de atividade", value: profile.activityLevel || "—" },
    { icon: Flame, label: "Nível de dor", value: profile.painLevel || "—" },
    { icon: Target, label: "Objetivos", value: profile.objectives?.length > 0 ? profile.objectives.join(", ") : "—" },
  ];

  const conditionItems = [
    {
      icon: Stethoscope,
      label: "Condições de saúde",
      value: profile.healthConditions?.length ? profile.healthConditions.join(", ") : "Nenhuma informada",
    },
    {
      icon: Heart,
      label: "Áreas afetadas",
      value: profile.affectedAreas?.length ? profile.affectedAreas.join(", ") : "Nenhuma informada",
    },
  ];

  const sections = [
    { id: "info" as const, label: "Informações", icon: Settings },
    { id: "evolution" as const, label: "Evolução", icon: TrendingUp },
    { id: "achievements" as const, label: "Conquistas", icon: Trophy },
    { id: "settings" as const, label: "Configurações", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxBarHeight = 80;

  return (
    <div className="levvia-page min-h-screen pb-24">
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-4">
          <AvatarUpload
            avatarUrl={profile.avatarUrl}
            name={profile.name || "Usuária"}
            onUploaded={() => refresh()}
          />
          <div className="flex-1">
            <h1 className="text-xl font-light text-foreground">{profile.name || "Usuária"}</h1>
            <p className="text-sm text-muted-foreground">Membro Levvia</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-white/[0.08] text-muted-foreground border border-white/[0.12] hover:border-destructive/30 hover:text-destructive transition-all cursor-pointer"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Sair
          </button>
        </div>
      </header>

      {/* Section tabs */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 flex-wrap">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-full font-medium transition-all ${
                activeSection === s.id
                  ? "bg-secondary text-foreground"
                  : "bg-white/[0.08] text-muted-foreground border border-white/[0.12]"
              }`}
            >
              <s.icon size={14} strokeWidth={1.5} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 space-y-6">
        {/* Info section */}
        {activeSection === "info" && (
          <>
            <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} profile={profile} onSaved={refresh} />

            <section className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User size={16} strokeWidth={1.5} className="text-secondary" />
                  Dados Pessoais
                </h2>
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-1 text-xs text-secondary hover:text-secondary/80 transition-colors"
                >
                  <Pencil size={13} strokeWidth={1.5} />
                  Editar
                </button>
              </div>
              {profileItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-0">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon size={14} strokeWidth={1.5} className="text-secondary/60" />
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%] truncate">{item.value}</span>
                </div>
              ))}
            </section>

            <section className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Stethoscope size={16} strokeWidth={1.5} className="text-secondary" />
                  Saúde
                </h2>
              </div>
              {conditionItems.map((item, i) => (
                <div key={i} className="px-4 py-3 border-b border-white/10 last:border-0">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <item.icon size={14} strokeWidth={1.5} className="text-secondary/60" />
                    {item.label}
                  </span>
                  <p className="text-sm font-medium text-foreground pl-6">{item.value}</p>
                </div>
              ))}
            </section>

            {/* Flow Silhouette with hydration */}
            <section className="glass-card p-5 flex flex-col items-center">
              <h2 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4 self-start">
                <Map size={14} strokeWidth={1.5} className="text-muted-foreground" />
                Meu Mapa de Fluxo
              </h2>
              <FlowSilhouette
                heatMapData={(() => {
                  const hm = (profile as any).heatMapDay1;
                  if (!hm || typeof hm !== "object") return {};
                  const mapped: Record<string, number> = {};
                  for (const [k, v] of Object.entries(hm)) {
                    mapped[k] = Math.min(3, Math.max(0, typeof v === "number" ? v : 0));
                  }
                  return mapped;
                })()}
                waterIntakeMl={(profile as any)?.water_intake_ml ?? 0}
                waterGoalMl={(profile as any)?.water_goal_ml ?? 2000}
              />
            </section>

            {/* Pantry section */}
            <section className="glass-card overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ShoppingCart size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  Minha Despensa
                </h2>
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-1 text-xs text-secondary hover:text-secondary/80 transition-colors"
                >
                  <Pencil size={13} strokeWidth={1.5} />
                  Atualizar
                </button>
              </div>
              <div className="px-4 py-3">
                {profile.pantryItems?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.pantryItems.map((item) => (
                      <span key={item} className="text-[11px] px-2.5 py-1 rounded-full bg-success/10 text-success">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Nenhum ingrediente adicionado ainda.</p>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <button onClick={resetChecklist} className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all">
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <RotateCcw size={18} strokeWidth={1.5} className="text-secondary" />
                  Resetar checklist de hoje
                </span>
                <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
              <button onClick={resetOnboarding} className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all">
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <RotateCcw size={18} strokeWidth={1.5} className="text-destructive" />
                  Refazer questionário inicial
                </span>
                <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
            </section>
          </>
        )}

        {/* Evolution section - REAL DATA */}
        {activeSection === "evolution" && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-3 flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center mb-1.5">
                  <Trophy size={18} strokeWidth={1.5} className="text-secondary" />
                </div>
                <span className="text-xl font-light text-foreground">{daysCompleted}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Dias completos</span>
              </motion.div>
              <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-3 flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center mb-1.5">
                  <Flame size={18} strokeWidth={1.5} className="text-accent" />
                </div>
                <span className="text-xl font-light text-foreground">{maxStreak}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Dias seguidos</span>
              </motion.div>
              <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-3 flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-success/20 flex items-center justify-center mb-1.5">
                  <TrendingUp size={18} strokeWidth={1.5} className="text-success" />
                </div>
                <span className="text-xl font-light text-foreground">{avgCompletion}%</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">Média geral</span>
              </motion.div>
            </div>

            {/* Flow Silhouette - Hydration Map */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.33 }} className="glass-card p-5 flex flex-col items-center">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1 self-start">
                💧 Seu mapa de leveza
              </h3>
              <p className="text-xs text-muted-foreground mb-4 self-start">
                A fita azul cresce conforme sua hidratação do dia
              </p>
              <FlowSilhouette
                heatMapData={(() => {
                  const hm = (profile as any).heatMapDay1;
                  if (!hm || typeof hm !== "object") return {};
                  const mapped: Record<string, number> = {};
                  for (const [k, v] of Object.entries(hm)) {
                    mapped[k] = Math.min(3, Math.max(0, typeof v === "number" ? v : 0));
                  }
                  return mapped;
                })()}
                waterIntakeMl={(profile as any)?.water_intake_ml ?? 0}
                waterGoalMl={(profile as any)?.water_goal_ml ?? 2000}
              />
            </motion.div>

            {/* Bar chart */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} strokeWidth={1.5} className="text-secondary" />
                <h3 className="text-sm font-medium text-foreground">Evolução por dia</h3>
              </div>
              <div className="flex items-end justify-between gap-1.5" style={{ height: maxBarHeight + 24 }}>
                {Array.from({ length: 14 }, (_, i) => {
                  const dayData = evolutionData.find((d) => d.day === i + 1);
                  const percent = dayData?.percent ?? 0;
                  const hasData = !!dayData;
                  const isComplete = percent === 100;
                  const barH = !hasData ? 4 : Math.max(4, (percent / 100) * maxBarHeight);

                  return (
                    <div key={i} className="flex flex-col items-center flex-1 gap-1">
                      <motion.div
                        initial={{ height: 4 }}
                        animate={{ height: barH }}
                        transition={{ delay: 0.4 + i * 0.04, duration: 0.4, ease: "easeOut" }}
                        className={`w-full rounded-full ${
                          !hasData
                            ? "bg-white/[0.08]"
                            : isComplete
                            ? "bg-gradient-to-t from-secondary to-success"
                            : percent > 0
                            ? "bg-secondary/40"
                            : "bg-white/[0.08]"
                        }`}
                      />
                      <span className={`text-[9px] font-medium ${hasData ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                        {i + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} strokeWidth={1.5} className="text-secondary" />
                <h3 className="text-sm font-medium text-foreground">Linha do tempo</h3>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 14 }, (_, i) => {
                  const dayData = evolutionData.find((d) => d.day === i + 1);
                  const percent = dayData?.percent ?? 0;
                  const hasData = !!dayData;
                  const isComplete = percent === 100;

                  return (
                    <div
                      key={i}
                      className={`flex-1 h-2.5 rounded-full transition-all ${
                        !hasData
                          ? "bg-white/[0.08]"
                          : isComplete
                          ? "bg-success"
                          : percent > 0
                          ? "bg-secondary/40"
                          : "bg-destructive/30"
                      }`}
                      title={`Dia ${i + 1}: ${hasData ? `${percent}%` : "—"}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] text-muted-foreground">Dia 1</span>
                <span className="text-[9px] text-muted-foreground">Dia 14</span>
              </div>
            </motion.div>

            {evolutionData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4 italic">
                Complete atividades diárias para ver sua evolução aqui.
              </p>
            )}
          </>
        )}

        {/* Achievements section - FUNCTIONAL */}
        {activeSection === "achievements" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={20} strokeWidth={1.5} className="text-accent" />
                <h2 className="text-base font-medium text-foreground">Conquistas</h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {unlockedAchievements.length}/{achievements.length} desbloqueadas
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {achievements.map((badge) => {
                const unlocked = unlockedAchievements.includes(badge);
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05 * achievements.indexOf(badge) }}
                    className={`relative flex flex-col items-center p-3 rounded-xl border transition-all ${
                      unlocked
                        ? "bg-white/[0.08] border-secondary/30"
                        : "bg-white/[0.03] border-white/[0.06] opacity-50"
                    }`}
                  >
                    {!unlocked && (
                      <div className="absolute top-1.5 right-1.5">
                        <Lock size={10} className="text-muted-foreground/50" />
                      </div>
                    )}
                    <span className={`text-2xl mb-1 ${unlocked ? "" : "grayscale"}`}>{badge.emoji}</span>
                    <span className="text-xs font-medium text-foreground text-center leading-tight">{badge.label}</span>
                    <span className="text-[10px] text-muted-foreground text-center mt-0.5 leading-tight">{badge.desc}</span>
                    {unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center"
                      >
                        <CheckCircle2 size={10} className="text-foreground" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {unlockedAchievements.length === achievements.length
                ? "🎉 Parabéns! Você desbloqueou todas as conquistas!"
                : "Continue completando suas tarefas diárias para desbloquear mais conquistas!"}
            </p>
          </section>
        )}

        {/* Settings section */}
        {activeSection === "settings" && (
          <section className="space-y-4">
            <NotificationSettings />
            <div className="space-y-3">
              <button
                onClick={() => navigate("/terms")}
                className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <FileText size={18} strokeWidth={1.5} className="text-secondary" />
                  Termos de Uso
                </span>
                <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
              <button
                onClick={() => navigate("/privacy")}
                className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <Shield size={18} strokeWidth={1.5} className="text-secondary" />
                  Política de Privacidade
                </span>
                <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-4 py-3.5 glass-card hover:bg-white/[0.09] transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-destructive">
                  <LogOut size={18} strokeWidth={1.5} />
                  Sair da conta
                </span>
                <ChevronRight size={18} strokeWidth={1.5} className="text-muted-foreground" />
              </button>
            </div>
          </section>
        )}

        <p className="text-xs text-muted-foreground text-center leading-relaxed px-4">
          Os conteúdos do Levvia são informativos e não substituem orientação médica profissional.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
