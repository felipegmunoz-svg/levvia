import { useState, useEffect, useMemo } from "react";
import { GraduationCap, Lock, ChevronRight, Lightbulb, Sparkles, HelpCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import logoIcon from "@/assets/logo_livvia_branco_icone.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LearnModule {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  content_paragraphs: string[];
  surprising_fact: string;
  practical_tip: string;
  reflection_question: string;
  icon: string;
}

const Learn = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<LearnModule[]>([]);
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set());
  const [selectedModule, setSelectedModule] = useState<LearnModule | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate current challenge day
  const currentDay = useMemo(() => {
    const start = localStorage.getItem("levvia_challenge_start");
    if (!start) return 1;
    const diff = Date.now() - new Date(start).getTime();
    const day = Math.floor(diff / 86400000) + 1;
    return Math.min(Math.max(day, 1), 14);
  }, []);

  // Load modules and progress
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: modulesData } = await supabase
        .from("learn_modules")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (modulesData) {
        setModules(modulesData as LearnModule[]);
      }

      if (user?.id) {
        const { data: progressData } = await supabase
          .from("user_module_progress")
          .select("module_id")
          .eq("user_id", user.id);

        if (progressData) {
          setCompletedModuleIds(new Set(progressData.map((p) => p.module_id)));
        }
      }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const handleComplete = async (moduleId: string) => {
    if (!user?.id || completedModuleIds.has(moduleId)) return;

    await supabase.from("user_module_progress").insert({
      user_id: user.id,
      module_id: moduleId,
    });

    setCompletedModuleIds((prev) => new Set([...prev, moduleId]));
  };

  // Module detail view
  if (selectedModule) {
    const isCompleted = completedModuleIds.has(selectedModule.id);
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="gradient-page px-6 pt-10 pb-6 rounded-b-3xl">
          <button
            onClick={() => setSelectedModule(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            <span className="text-sm">Voltar</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={18} strokeWidth={1.5} className="text-secondary" />
            <span className="text-xs text-muted-foreground font-medium">Dia {selectedModule.day}</span>
          </div>
          <h1 className="text-xl font-light text-foreground">{selectedModule.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{selectedModule.subtitle}</p>
        </header>

        <main className="px-5 mt-6 space-y-5">
          {/* Content paragraphs */}
          {selectedModule.content_paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm text-foreground/90 leading-relaxed"
            >
              {p}
            </motion.p>
          ))}

          {/* Surprising fact */}
          {selectedModule.surprising_fact && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
                <span className="text-sm font-medium text-accent">Fato surpreendente</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{selectedModule.surprising_fact}</p>
            </motion.div>
          )}

          {/* Practical tip */}
          {selectedModule.practical_tip && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} strokeWidth={1.5} className="text-secondary" />
                <span className="text-sm font-medium text-secondary">Dica prática</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{selectedModule.practical_tip}</p>
            </motion.div>
          )}

          {/* Reflection question */}
          {selectedModule.reflection_question && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={16} strokeWidth={1.5} className="text-success" />
                <span className="text-sm font-medium text-success">Para refletir</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed italic">"{selectedModule.reflection_question}"</p>
            </motion.div>
          )}

          {/* Mark as completed */}
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => {
              handleComplete(selectedModule.id);
              setSelectedModule(null);
            }}
            disabled={isCompleted}
            className={`w-full py-3.5 rounded-3xl font-medium text-sm transition-all ${
              isCompleted
                ? "bg-success/20 text-success cursor-default"
                : "gradient-primary text-foreground"
            }`}
          >
            {isCompleted ? "✓ Módulo concluído" : "Concluir módulo"}
          </motion.button>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Module list view
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="gradient-page px-6 pt-10 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-1">
          <img src={logoIcon} alt="Levvia" className="w-8 h-auto" />
          <p className="text-muted-foreground text-sm font-medium">Aprender</p>
        </div>
        <h1 className="text-2xl font-light text-foreground mt-1">
          Conhecimento que transforma
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          Um novo módulo é desbloqueado a cada dia do desafio. Aprenda sobre seu corpo e potencialize seus resultados.
        </p>

        {/* Progress indicator */}
        <div className="mt-4 glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center">
            <GraduationCap size={18} strokeWidth={1.5} className="text-secondary" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">
              {completedModuleIds.size} de {modules.length} módulos
            </span>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-1">
              <div
                className="h-full bg-gradient-to-r from-secondary to-success rounded-full transition-all duration-500"
                style={{ width: modules.length > 0 ? `${(completedModuleIds.size / modules.length) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 mt-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap size={40} strokeWidth={1} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Módulos em breve!</p>
          </div>
        ) : (
          <AnimatePresence>
            {modules.map((mod, i) => {
              const isUnlocked = mod.day <= currentDay;
              const isCompleted = completedModuleIds.has(mod.id);

              return (
                <motion.button
                  key={mod.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => isUnlocked && setSelectedModule(mod)}
                  disabled={!isUnlocked}
                  className={`w-full glass-card p-4 flex items-center gap-4 text-left transition-all ${
                    isUnlocked ? "hover:border-secondary/30" : "opacity-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? "bg-success/20"
                        : isUnlocked
                        ? "bg-secondary/20"
                        : "bg-white/[0.06]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} strokeWidth={1.5} className="text-success" />
                    ) : isUnlocked ? (
                      <GraduationCap size={18} strokeWidth={1.5} className="text-secondary" />
                    ) : (
                      <Lock size={16} strokeWidth={1.5} className="text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-medium">Dia {mod.day}</span>
                      {isCompleted && (
                        <span className="text-[10px] text-success font-medium">Concluído</span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-foreground truncate">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{mod.subtitle}</p>
                  </div>

                  {isUnlocked && (
                    <ChevronRight size={16} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Learn;
