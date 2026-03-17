import { useMemo } from "react";
import { Flame, Trophy, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { challengeDays } from "@/data/challengeDays";
import { motion } from "framer-motion";
import SymptomEvolutionChart from "@/components/SymptomEvolutionChart";

interface ProgressDashboardProps {
  currentDay: number;
  progress: Record<string, Record<string, boolean>>;
}

const ProgressDashboard = ({ currentDay, progress }: ProgressDashboardProps) => {
  // Calculate completion % for each day
  const dailyCompletion = useMemo(() => {
    return challengeDays.slice(0, currentDay).map((day) => {
      const dayActivities = [...day.exercises, ...day.recipes, ...day.habits];
      const total = dayActivities.length;
      const dayProgress = progress[day.day] || {};
      const completed = dayActivities.filter((a) => dayProgress[a.id]).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { day: day.day, completed, total, percent };
    });
  }, [currentDay, progress]);

  // Days fully completed
  const daysCompleted = dailyCompletion.filter((d) => d.percent === 100).length;

  // Streak: consecutive completed days ending at currentDay or the latest completed
  const streak = useMemo(() => {
    let s = 0;
    for (let i = dailyCompletion.length - 1; i >= 0; i--) {
      if (dailyCompletion[i].percent === 100) s++;
      else break;
    }
    return s;
  }, [dailyCompletion]);

  // Overall average
  const avgCompletion = useMemo(() => {
    if (dailyCompletion.length === 0) return 0;
    const sum = dailyCompletion.reduce((acc, d) => acc + d.percent, 0);
    return Math.round(sum / dailyCompletion.length);
  }, [dailyCompletion]);

  // Chart bar max height
  const maxBarHeight = 64;

  return (
    <section className="mx-5 mt-4 space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-3 flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center mb-1.5">
            <Trophy size={18} strokeWidth={1.5} className="text-secondary" />
          </div>
          <span className="text-xl font-light text-foreground">{daysCompleted}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">Dias completos</span>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-3 flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center mb-1.5">
            <Flame size={18} strokeWidth={1.5} className="text-accent" />
          </div>
          <span className="text-xl font-light text-foreground">{streak}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">Dias seguidos</span>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-3 flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-xl bg-success/20 flex items-center justify-center mb-1.5">
            <TrendingUp size={18} strokeWidth={1.5} className="text-success" />
          </div>
          <span className="text-xl font-light text-foreground">{avgCompletion}%</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">Média geral</span>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} strokeWidth={1.5} className="text-secondary" />
          <h3 className="text-sm font-medium text-foreground">Evolução por dia</h3>
        </div>

        <div className="flex items-end justify-between gap-1.5" style={{ height: maxBarHeight + 24 }}>
          {Array.from({ length: 14 }, (_, i) => {
            const dayData = dailyCompletion.find((d) => d.day === i + 1);
            const percent = dayData?.percent ?? 0;
            const isCurrent = i + 1 === currentDay;
            const isFuture = i + 1 > currentDay;
            const isComplete = percent === 100;
            const barH = isFuture ? 4 : Math.max(4, (percent / 100) * maxBarHeight);

            return (
              <div key={i} className="flex flex-col items-center flex-1 gap-1">
                <motion.div
                  initial={{ height: 4 }}
                  animate={{ height: barH }}
                  transition={{ delay: 0.4 + i * 0.04, duration: 0.4, ease: "easeOut" }}
                  className={`w-full rounded-full ${
                    isFuture
                      ? "bg-white/[0.06]"
                      : isComplete
                      ? "bg-gradient-to-t from-secondary to-success"
                      : isCurrent
                      ? "bg-gradient-to-t from-secondary/80 to-secondary"
                      : percent > 0
                      ? "bg-secondary/40"
                      : "bg-white/[0.08]"
                  }`}
                />
                <span
                  className={`text-[9px] font-medium ${
                    isCurrent
                      ? "text-secondary"
                      : isFuture
                      ? "text-muted-foreground/30"
                      : "text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Day timeline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={16} strokeWidth={1.5} className="text-secondary" />
          <h3 className="text-sm font-medium text-foreground">Linha do tempo</h3>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 14 }, (_, i) => {
            const dayData = dailyCompletion.find((d) => d.day === i + 1);
            const percent = dayData?.percent ?? 0;
            const isCurrent = i + 1 === currentDay;
            const isFuture = i + 1 > currentDay;
            const isComplete = percent === 100;

            return (
              <div
                key={i}
                className={`flex-1 h-2.5 rounded-full transition-all ${
                  isFuture
                    ? "bg-white/[0.06]"
                    : isComplete
                    ? "bg-success"
                    : isCurrent
                    ? "bg-secondary animate-pulse"
                    : percent > 0
                    ? "bg-secondary/40"
                    : "bg-destructive/30"
                }`}
                title={`Dia ${i + 1}: ${isFuture ? "—" : `${percent}%`}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-muted-foreground">Dia 1</span>
          <span className="text-[9px] text-muted-foreground">Dia 14</span>
        </div>
      </motion.div>
    </section>
  );
};

export default ProgressDashboard;
