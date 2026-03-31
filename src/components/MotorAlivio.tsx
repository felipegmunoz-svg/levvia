import { useState, useEffect, useCallback } from "react";
import { HeartPulse, X, ArrowRight, ArrowLeft, Snowflake, Wind, AlertTriangle, RotateCcw, Sparkles, Footprints, Activity, Dumbbell, PersonStanding, BedDouble, Briefcase, MoveHorizontal, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { DbExercise } from "@/lib/profileEngine";

interface MotorAlivioProps {
  onSelectExercise: (exercise: DbExercise) => void;
}

// ─── Mappings ───

const intensidadeMap: Record<string, { pain_min: number; pain_max: number }> = {
  crise: { pain_min: 9, pain_max: 10 },
  cansada: { pain_min: 6, pain_max: 8 },
  energia: { pain_min: 1, pain_max: 7 },
};

const regiaoMap: Record<string, string[] | null> = {
  tornozelo: ["tornozelo"],
  coxas: ["coxa", "gluteo"],
  bracos: ["braco", "tronco"],
  corpo_todo: null,
};

const ambienteMap: Record<string, string[]> = {
  cama: ["cama", "sofa"],
  trabalho: ["cadeira"],
  espaco: ["em_pe", "chao"],
};

interface CheckIn {
  id: string;
  user_id: string;
  data_checkin: string;
  intensidade: string;
  regiao: string;
  ambiente: string;
  exercicios_ids: string[];
  created_at: string;
}

type Respostas = { intensidade: string; regiao: string; ambiente: string };

type DotOption = { value: string; dotColor: string; label: string; desc: string; color: string };
type IconOption = { value: string; icon: LucideIcon; label: string; desc: string; color: string };
type QuestionOption = DotOption | IconOption;

// ─── Questions data ───

const questions: { field: keyof Respostas; title: string; subtitle: string; options: QuestionOption[] }[] = [
  {
    field: "intensidade" as const,
    title: "Como você está hoje?",
    subtitle: "Escolha o que melhor descreve como suas pernas estão agora",
    options: [
      { value: "crise",   dotColor: "#EF4444", label: "Pesadas e Doloridas",       desc: "Crise",    color: "border-destructive/30 hover:border-destructive/50 bg-destructive/5" },
      { value: "cansada", dotColor: "#F59E0B", label: "Cansadas, mas suportáveis", desc: "Dia comum", color: "border-yellow-500/30 hover:border-yellow-500/50 bg-yellow-500/5" },
      { value: "energia", dotColor: "#10B981", label: "Estou com energia hoje!",   desc: "Dia bom",   color: "border-success/30 hover:border-success/50 bg-success/5" },
    ],
  },
  {
    field: "regiao" as const,
    title: "Onde você quer focar o alívio?",
    subtitle: "Selecione a região do corpo para os exercícios",
    options: [
      { value: "tornozelo", icon: Footprints,     label: "Tornozelos e Pés",   desc: "Membros inferiores", color: "border-secondary/30 hover:border-secondary/50 bg-secondary/5" },
      { value: "coxas",     icon: Activity,       label: "Coxas e Glúteos",    desc: "Região superior",    color: "border-secondary/30 hover:border-secondary/50 bg-secondary/5" },
      { value: "bracos",    icon: Dumbbell,       label: "Braços e Tronco",    desc: "Parte superior",     color: "border-secondary/30 hover:border-secondary/50 bg-secondary/5" },
      { value: "corpo_todo",icon: PersonStanding, label: "Corpo Todo",          desc: "Geral",              color: "border-secondary/30 hover:border-secondary/50 bg-secondary/5" },
    ],
  },
  {
    field: "ambiente" as const,
    title: "Onde você está agora?",
    subtitle: "Para sugerir exercícios que cabem no seu espaço",
    options: [
      { value: "cama",     icon: BedDouble,      label: "Na Cama ou Sofá",           desc: "Deitada/reclinada",  color: "border-secondary/30 hover:border-secondary/50 bg-secondary/5" },
      { value: "trabalho", icon: Briefcase,      label: "No Trabalho",               desc: "Sentada",            color: "border-secondary/30 hover:border-secondary/50 bg-secondary/5" },
      { value: "espaco",   icon: MoveHorizontal, label: "Tenho espaço para me mover",desc: "Em pé / chão livre", color: "border-secondary/30 hover:border-secondary/50 bg-secondary/5" },
    ],
  },
];

const reliefTips = [
  { icon: Snowflake, text: "Aplique gelo envolvido em pano na articulação por 15 min", color: "text-secondary" },
  { icon: Wind, text: "Respire fundo: inspire 4s, segure 4s, expire 6s — repita 5x", color: "text-success" },
];

// ─── Fetch helpers ───

async function buscarExercicios(respostas: Respostas): Promise<DbExercise[]> {
  const mapping = intensidadeMap[respostas.intensidade];
  if (!mapping) {
    console.error('❌ [Motor Alívio] Intensidade não mapeada:', respostas.intensidade);
    return [];
  }

  const { pain_min, pain_max } = mapping;
  const bodyParts = regiaoMap[respostas.regiao];
  const environments = ambienteMap[respostas.ambiente];

  console.log('🔍 [Motor Alívio] Buscando:', { intensidade: respostas.intensidade, painRange: `${pain_min}-${pain_max}`, bodyParts, environments });

  try {
    // Primary query
    let query = supabase
      .from("exercises")
      .select("*")
      .eq("is_active", true)
      .gte("pain_suitability", pain_min)
      .lte("pain_suitability", pain_max);

    if (bodyParts) {
      query = query.overlaps("body_part", bodyParts);
    }

    query = query.overlaps("environment", environments).order("pain_suitability", { ascending: false }).limit(5);

    const { data, error } = await query;
    if (error) console.warn('⚠️ [Motor Alívio] Erro query primária:', error.message);
    let results = (data as DbExercise[]) || [];
    console.log(`📊 [Motor Alívio] Query primária: ${results.length} resultados`);

    // Fallback 1: relax environment
    if (results.length < 3) {
      console.log('🔄 [Motor Alívio] Fallback 1: relaxando ambiente...');
      let q2 = supabase
        .from("exercises")
        .select("*")
        .eq("is_active", true)
        .gte("pain_suitability", pain_min)
        .lte("pain_suitability", pain_max);

      if (bodyParts) {
        q2 = q2.overlaps("body_part", bodyParts);
      }

      q2 = q2.order("pain_suitability", { ascending: false }).limit(5);
      const { data: d2, error: e2 } = await q2;
      if (e2) console.warn('⚠️ [Motor Alívio] Erro fallback 1:', e2.message);
      results = (d2 as DbExercise[]) || [];
      console.log(`📊 [Motor Alívio] Fallback 1: ${results.length} resultados`);
    }

    // Fallback 2: relax region too (never relax pain)
    if (results.length < 3) {
      console.log('🔄 [Motor Alívio] Fallback 2: relaxando região...');
      const { data: d3, error: e3 } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_active", true)
        .gte("pain_suitability", pain_min)
        .lte("pain_suitability", pain_max)
        .order("pain_suitability", { ascending: false })
        .limit(5);
      if (e3) console.warn('⚠️ [Motor Alívio] Erro fallback 2:', e3.message);
      results = (d3 as DbExercise[]) || [];
      console.log(`📊 [Motor Alívio] Fallback 2: ${results.length} resultados`);
    }

    console.log(`✅ [Motor Alívio] ${results.length} exercícios retornados`);
    return results;
  } catch (error) {
    console.error('❌ [Motor Alívio] Erro inesperado em buscarExercicios:', error);
    return [];
  }
}

async function verificarCriseProlongada(userId: string): Promise<{ mostrar: boolean; mensagem: string }> {
  const { data } = await supabase
    .from("daily_check_ins")
    .select("intensidade, data_checkin")
    .eq("user_id", userId)
    .order("data_checkin", { ascending: false })
    .limit(3);

  if (data && data.length >= 3) {
    const todosCrise = data.every((d: any) => d.intensidade === "crise");
    if (todosCrise) {
      return {
        mostrar: true,
        mensagem: "Você está em crise há 3 dias seguidos. Que tal conversar com um profissional de saúde?",
      };
    }
  }
  return { mostrar: false, mensagem: "" };
}

// ─── Component ───

type ViewState = "loading" | "initial" | "questions" | "results";

const MotorAlivio = ({ onSelectExercise }: MotorAlivioProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>({ intensidade: "", regiao: "", ambiente: "" });
  const [exercises, setExercises] = useState<DbExercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<CheckIn | null>(null);
  const [yesterdayCheckIn, setYesterdayCheckIn] = useState<CheckIn | null>(null);
  const [criseAlert, setCriseAlert] = useState<{ mostrar: boolean; mensagem: string }>({ mostrar: false, mensagem: "" });

  const hoje = new Date().toISOString().split("T")[0];
  const ontem = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split("T")[0]; })();

  const loadInitialState = useCallback(async () => {
    if (!user?.id) {
      setViewState("questions");
      return;
    }

    setViewState("loading");

    try {
      const [todayRes, yesterdayRes] = await Promise.all([
        supabase.from("daily_check_ins").select("*").eq("user_id", user.id).eq("data_checkin", hoje).maybeSingle(),
        supabase.from("daily_check_ins").select("*").eq("user_id", user.id).eq("data_checkin", ontem).maybeSingle(),
      ]);

      const todayData = todayRes.data as CheckIn | null;
      const yesterdayData = yesterdayRes.data as CheckIn | null;

      setTodayCheckIn(todayData);
      setYesterdayCheckIn(yesterdayData);

      if (todayData) {
        await loadExercisesFromCheckIn(todayData);
        setRespostas({ intensidade: todayData.intensidade, regiao: todayData.regiao, ambiente: todayData.ambiente });
        setViewState("results");
      } else if (yesterdayData) {
        setViewState("initial");
      } else {
        setViewState("questions");
        setEtapa(0);
      }

      const alert = await verificarCriseProlongada(user.id);
      setCriseAlert(alert);
    } catch (error) {
      console.error('❌ [Motor Alívio] Erro em loadInitialState:', error);
      setViewState("questions");
      setEtapa(0);
    }
  }, [user?.id, hoje, ontem]);

  const loadExercisesFromCheckIn = async (checkIn: CheckIn) => {
    try {
      if (checkIn.exercicios_ids && checkIn.exercicios_ids.length > 0) {
        const { data, error } = await supabase
          .from("exercises")
          .select("*")
          .in("id", checkIn.exercicios_ids);
        if (error) console.warn('⚠️ [Motor Alívio] Erro ao carregar exercícios do check-in:', error.message);
        setExercises((data as DbExercise[]) || []);
      } else {
        const r: Respostas = { intensidade: checkIn.intensidade, regiao: checkIn.regiao, ambiente: checkIn.ambiente };
        const exs = await buscarExercicios(r);
        setExercises(exs);
      }
    } catch (error) {
      console.error('❌ [Motor Alívio] Erro em loadExercisesFromCheckIn:', error);
      setExercises([]);
    }
  };

  useEffect(() => {
    if (open) loadInitialState();
  }, [open, loadInitialState]);

  const handleAnswer = async (field: keyof Respostas, value: string) => {
    const updated = { ...respostas, [field]: value };
    setRespostas(updated);

    if (etapa < 2) {
      setEtapa(etapa + 1);
    } else {
      // All answered — fetch exercises
      setLoadingExercises(true);
      setViewState("results");
      try {
        const exs = await buscarExercicios(updated);
        setExercises(exs);

        // Save check-in
        if (user?.id) {
          await supabase.from("daily_check_ins").upsert(
            {
              user_id: user.id,
              data_checkin: hoje,
              intensidade: updated.intensidade,
              regiao: updated.regiao,
              ambiente: updated.ambiente,
              exercicios_ids: exs.map((e) => e.id),
            },
            { onConflict: "user_id,data_checkin" }
          );

          const alert = await verificarCriseProlongada(user.id);
          setCriseAlert(alert);
        }
      } catch (error) {
        console.error('❌ [Motor Alívio] Erro em handleAnswer:', error);
      } finally {
        setLoadingExercises(false);
      }
    }
  };

  const handleRepeatYesterday = async () => {
    if (!yesterdayCheckIn) return;
    const r: Respostas = { intensidade: yesterdayCheckIn.intensidade, regiao: yesterdayCheckIn.regiao, ambiente: yesterdayCheckIn.ambiente };
    setRespostas(r);
    setLoadingExercises(true);
    setViewState("results");
    try {
      await loadExercisesFromCheckIn(yesterdayCheckIn);

      if (user?.id) {
        await supabase.from("daily_check_ins").upsert(
          {
            user_id: user.id,
            data_checkin: hoje,
            intensidade: r.intensidade,
            regiao: r.regiao,
            ambiente: r.ambiente,
            exercicios_ids: yesterdayCheckIn.exercicios_ids,
          },
          { onConflict: "user_id,data_checkin" }
        );
      }
    } catch (error) {
      console.error('❌ [Motor Alívio] Erro em handleRepeatYesterday:', error);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleNewCheckIn = () => {
    setRespostas({ intensidade: "", regiao: "", ambiente: "" });
    setEtapa(0);
    setViewState("questions");
  };

  const handleClose = () => {
    setOpen(false);
    setViewState("loading");
    setEtapa(0);
    setRespostas({ intensidade: "", regiao: "", ambiente: "" });
    setExercises([]);
  };

  const intensidadeLabel = respostas.intensidade === "crise" ? "Crise" : respostas.intensidade === "cansada" ? "Cansada" : respostas.intensidade === "energia" ? "Com energia" : "";

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full glass-card p-4 flex items-center gap-3 border-destructive/20 hover:border-destructive/40 transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center animate-pulse">
          <HeartPulse size={20} strokeWidth={1.5} className="text-destructive" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-medium text-foreground">Motor de Alívio</h3>
          <p className="text-xs text-muted-foreground">Exercícios personalizados para como você está agora</p>
        </div>
        <ArrowRight size={16} className="text-muted-foreground" />
      </button>

      {/* Full-screen modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto"
          >
            <div className="max-w-md mx-auto px-5 py-8 pb-24">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <HeartPulse size={20} strokeWidth={1.5} className="text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-foreground">Motor de Alívio</h2>
                    <p className="text-xs text-muted-foreground">
                      {viewState === "questions" ? `Pergunta ${etapa + 1} de 3` : "Exercícios para você"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Progress bar (3 segments) */}
              {viewState === "questions" && (
                <div className="flex gap-1.5 mb-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-secondary to-success rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: i <= etapa ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Loading state */}
              {viewState === "loading" && (
                <div className="flex justify-center py-16">
                  <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Initial state: yesterday exists, offer repeat */}
              {viewState === "initial" && yesterdayCheckIn && (
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4">
                  <div className="glass-card p-5 text-center">
                    <RotateCcw size={24} strokeWidth={1.5} className="text-secondary mx-auto mb-3" />
                    <h3 className="text-base font-medium text-foreground mb-1">Repetir exercícios de ontem?</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Ontem você estava "{yesterdayCheckIn.intensidade === "crise" ? "em crise" : yesterdayCheckIn.intensidade === "cansada" ? "cansada" : "com energia"}" e focou em exercícios para esse estado.
                    </p>
                    <button
                      onClick={handleRepeatYesterday}
                      className="w-full py-3 rounded-2xl gradient-primary text-foreground font-medium text-sm mb-2"
                    >
                      Repetir exercícios de ontem
                    </button>
                    <button
                      onClick={handleNewCheckIn}
                      className="w-full py-3 rounded-2xl bg-white/[0.06] text-foreground font-medium text-sm border border-white/10 hover:border-secondary/30 transition-all"
                    >
                      Fazer novo check-in
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Questions flow */}
              {viewState === "questions" && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={etapa}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="mb-2">
                      <h3 className="text-lg font-medium text-foreground">{questions[etapa].title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{questions[etapa].subtitle}</p>
                    </div>

                    <div className="space-y-2">
                      {questions[etapa].options.map((opt, i) => (
                        <motion.button
                          key={opt.value}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.08 }}
                          onClick={() => handleAnswer(questions[etapa].field, opt.value)}
                          className={`w-full glass-card p-4 flex items-center gap-4 text-left transition-all ${opt.color}`}
                        >
                          {'dotColor' in opt
                            ? <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: opt.dotColor }} />
                            : <opt.icon size={20} className="text-levvia-muted shrink-0" strokeWidth={1.5} />
                          }
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-foreground">{opt.label}</h4>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground" />
                        </motion.button>
                      ))}
                    </div>

                    {etapa > 0 && (
                      <button
                        onClick={() => setEtapa(etapa - 1)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-2"
                      >
                        <ArrowLeft size={12} /> Voltar
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Results */}
              {viewState === "results" && (
                <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4">
                  {/* Summary badge */}
                  {intensidadeLabel && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.08] text-muted-foreground font-medium">
                        {intensidadeLabel}
                      </span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.08] text-muted-foreground font-medium">
                        {questions[1].options.find((o) => o.value === respostas.regiao)?.label || ""}
                      </span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.08] text-muted-foreground font-medium">
                        {questions[2].options.find((o) => o.value === respostas.ambiente)?.label || ""}
                      </span>
                    </div>
                  )}

                  {/* Crisis alert */}
                  {criseAlert.mostrar && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="glass-card p-4 border-yellow-500/30 bg-yellow-500/5"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={18} strokeWidth={1.5} className="text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground/90">{criseAlert.mensagem}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Quick tips */}
                  {respostas.intensidade === "crise" && (
                    <div className="space-y-2">
                      <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Dicas rápidas</h3>
                      {reliefTips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-card p-3 flex items-center gap-3"
                        >
                          <tip.icon size={18} strokeWidth={1.5} className={tip.color} />
                          <p className="text-sm text-foreground/90">{tip.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Exercise list */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} strokeWidth={1.5} className="text-secondary" />
                      <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Seus exercícios</h3>
                    </div>
                    {loadingExercises ? (
                      <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : exercises.length === 0 ? (
                      <div className="text-center py-8 space-y-3">
                        <p className="text-2xl">😔</p>
                        <p className="text-sm text-foreground/80">Não encontramos exercícios para esses critérios.</p>
                        <p className="text-xs text-muted-foreground">Vamos tentar com filtros diferentes?</p>
                        <button
                          onClick={handleNewCheckIn}
                          className="mt-2 px-4 py-2 rounded-xl bg-secondary/20 text-secondary text-sm font-medium hover:bg-secondary/30 transition-colors"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    ) : (
                      exercises.map((ex, i) => (
                        <motion.button
                          key={ex.id}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          onClick={() => {
                            handleClose();
                            onSelectExercise(ex);
                          }}
                          className="w-full glass-card p-4 flex items-center gap-3 text-left hover:border-secondary/30 transition-all"
                        >
                          <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                            <HeartPulse size={16} strokeWidth={1.5} className="text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground">{ex.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground">{ex.level}</span>
                              <span className="text-[10px] text-muted-foreground">•</span>
                              <span className="text-[10px] text-muted-foreground">{ex.duration}</span>
                              {ex.movement_type && (
                                <>
                                  <span className="text-[10px] text-muted-foreground">•</span>
                                  <span className="text-[10px] text-muted-foreground">{ex.movement_type}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                        </motion.button>
                      ))
                    )}
                  </div>

                  {/* Redo button */}
                  <button
                    onClick={handleNewCheckIn}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mx-auto mt-2"
                  >
                    <RotateCcw size={12} /> Refazer check-in
                  </button>

                  {/* Reassurance */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-muted-foreground text-center mt-4 italic"
                  >
                    💚 Lembre-se: respeite seus limites. Faça apenas o que for confortável.
                  </motion.p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MotorAlivio;
