import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { useChallengeData } from "@/hooks/useChallengeData";
import { supabase } from "@/integrations/supabase/client";

interface LearnModule {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  content_paragraphs: string[];
  practical_tip: string;
  reflection_question: string;
  surprising_fact: string;
  icon: string | null;
}

const HistoryKnowledge = () => {
  const navigate = useNavigate();
  const { currentDay } = useChallengeData();
  const [modules, setModules] = useState<LearnModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<LearnModule | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("learn_modules")
        .select("*")
        .eq("is_active", true)
        .order("day");
      setModules((data as LearnModule[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const unlockedModules = useMemo(() => {
    return modules.filter((m) => m.day <= currentDay);
  }, [modules, currentDay]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="gradient-page px-6 pt-10 pb-6 rounded-b-3xl">
        <button onClick={() => navigate("/history")} className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Voltar
        </button>
        <h1 className="text-2xl font-light text-foreground">📚 Conhecimento</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {unlockedModules.length} pílulas desbloqueadas
        </p>
      </header>

      <main className="px-5 mt-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : unlockedModules.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ainda não há conhecimento desbloqueado. Complete os dias da sua jornada para construir seu histórico.
            </p>
          </div>
        ) : (
          unlockedModules.map((mod, i) => (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedModule(mod)}
              className="glass-card p-4 w-full text-left flex items-center gap-3 transition-all hover:border-secondary/30 active:scale-[0.98]"
            >
              <span className="text-2xl">📚</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Dia {mod.day} da jornada • {mod.subtitle}</p>
              </div>
            </motion.button>
          ))
        )}
      </main>

      {/* Module detail modal */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto"
            onClick={() => setSelectedModule(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 max-w-lg mx-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedModule(null)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              <p className="text-xs text-secondary mb-1">Dia {selectedModule.day}</p>
              <h2 className="text-lg font-medium text-foreground mb-1">{selectedModule.title}</h2>
              <p className="text-xs text-muted-foreground mb-4">{selectedModule.subtitle}</p>

              <div className="space-y-3 text-sm text-foreground/90 leading-relaxed">
                {selectedModule.content_paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {selectedModule.surprising_fact && (
                <div className="glass-card p-3 mt-4">
                  <p className="text-xs font-medium text-accent mb-1">💡 Fato surpreendente</p>
                  <p className="text-xs text-foreground/80">{selectedModule.surprising_fact}</p>
                </div>
              )}

              {selectedModule.practical_tip && (
                <div className="glass-card p-3 mt-3">
                  <p className="text-xs font-medium text-secondary mb-1">🎯 Dica prática</p>
                  <p className="text-xs text-foreground/80">{selectedModule.practical_tip}</p>
                </div>
              )}

              {selectedModule.reflection_question && (
                <div className="glass-card p-3 mt-3">
                  <p className="text-xs font-medium text-foreground mb-1">🤔 Reflexão</p>
                  <p className="text-xs text-muted-foreground italic">{selectedModule.reflection_question}</p>
                </div>
              )}

              <button
                onClick={() => setSelectedModule(null)}
                className="mt-5 w-full py-3 rounded-3xl gradient-primary text-foreground font-medium text-sm"
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default HistoryKnowledge;
