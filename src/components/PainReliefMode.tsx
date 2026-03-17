import { useState, useEffect } from "react";
import { HeartPulse, X, ArrowRight, Snowflake, Wind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { DbExercise } from "@/lib/profileEngine";

interface PainReliefModeProps {
  onSelectExercise: (exercise: DbExercise) => void;
}

const reliefTips = [
  { icon: Snowflake, text: "Aplique gelo envolvido em pano na articulação por 15 min", color: "text-secondary" },
  { icon: Wind, text: "Respire fundo: inspire 4s, segure 4s, expire 6s — repita 5x", color: "text-success" },
];

const PainReliefMode = ({ onSelectExercise }: PainReliefModeProps) => {
  const [open, setOpen] = useState(false);
  const [exercises, setExercises] = useState<DbExercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("exercises")
        .select("*")
        .eq("is_active", true)
        .in("category", ["Posições de Alívio de Dor", "Respiração e Relaxamento"])
        .order("sort_order", { ascending: true });
      setExercises((data as DbExercise[]) || []);
      setLoading(false);
    };
    load();
  }, [open]);

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
          <h3 className="text-sm font-medium text-foreground">Estou com dor agora</h3>
          <p className="text-xs text-muted-foreground">Alívio imediato com posições e respiração</p>
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
                    <h2 className="text-lg font-medium text-foreground">Alívio Rápido</h2>
                    <p className="text-xs text-muted-foreground">Posições e técnicas para agora</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Quick tips */}
              <div className="space-y-2 mb-6">
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

              {/* Exercises */}
              <div className="space-y-2">
                <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Exercícios de alívio</h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : exercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum exercício de alívio cadastrado.</p>
                ) : (
                  exercises.map((ex, i) => (
                    <motion.button
                      key={ex.id}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      onClick={() => {
                        setOpen(false);
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
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                    </motion.button>
                  ))
                )}
              </div>

              {/* Reassurance */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-muted-foreground text-center mt-6 italic"
              >
                💚 Lembre-se: respeite seus limites. Faça apenas o que for confortável.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PainReliefMode;
