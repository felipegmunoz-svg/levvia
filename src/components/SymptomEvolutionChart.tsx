import { useState, useEffect, useMemo } from "react";
import { TrendingDown, TrendingUp, Activity, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SymptomEntry {
  date: string;
  pain_level: number;
  swelling: string;
  mood: string;
}

const SymptomEvolutionChart = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      const { data } = await supabase
        .from("symptom_entries")
        .select("date, pain_level, swelling, mood")
        .eq("user_id", user.id)
        .order("date", { ascending: true })
        .limit(14);
      setEntries((data as SymptomEntry[]) || []);
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const chartData = useMemo(() => {
    return entries.map((e) => ({
      day: new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      dor: e.pain_level,
    }));
  }, [entries]);

  const summary = useMemo(() => {
    if (entries.length < 2) return null;
    const first = entries[0].pain_level;
    const last = entries[entries.length - 1].pain_level;
    const diff = first - last;
    const avg = entries.reduce((s, e) => s + e.pain_level, 0) / entries.length;
    return { first, last, diff, avg: Math.round(avg * 10) / 10 };
  }, [entries]);

  if (loading) {
    return (
      <div className="glass-card p-4 flex justify-center">
        <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 text-center"
      >
        <Activity size={24} strokeWidth={1} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Registre seus sintomas diários para ver a evolução aqui.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 flex flex-col items-center">
            <span className="text-[10px] text-muted-foreground mb-1">Primeiro registro</span>
            <span className="text-xl font-light text-foreground">{summary.first}</span>
          </div>
          <div className="glass-card p-3 flex flex-col items-center">
            <span className="text-[10px] text-muted-foreground mb-1">Último registro</span>
            <span className="text-xl font-light text-foreground">{summary.last}</span>
          </div>
          <div className="glass-card p-3 flex flex-col items-center">
            <span className="text-[10px] text-muted-foreground mb-1">Variação</span>
            <div className="flex items-center gap-1">
              {summary.diff > 0 ? (
                <TrendingDown size={14} className="text-success" />
              ) : summary.diff < 0 ? (
                <TrendingUp size={14} className="text-destructive" />
              ) : (
                <Minus size={14} className="text-muted-foreground" />
              )}
              <span className={`text-xl font-light ${
                summary.diff > 0 ? "text-success" : summary.diff < 0 ? "text-destructive" : "text-foreground"
              }`}>
                {summary.diff > 0 ? `-${summary.diff}` : summary.diff < 0 ? `+${Math.abs(summary.diff)}` : "0"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {summary && summary.diff > 0 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-3 border-success/20 text-center"
        >
          <p className="text-sm text-success font-medium">
            🎉 Sua dor reduziu {summary.diff} ponto{summary.diff > 1 ? "s" : ""}!
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Continue assim, seu corpo está respondendo.</p>
        </motion.div>
      )}

      {/* Chart */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} strokeWidth={1.5} className="text-secondary" />
          <h3 className="text-sm font-medium text-foreground">Evolução da dor</h3>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(196, 58%, 42%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(196, 58%, 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "hsl(210, 33%, 65%)" }}
                axisLine={{ stroke: "rgba(0,0,0,0.08)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: "hsl(210, 33%, 65%)" }}
                axisLine={{ stroke: "rgba(0,0,0,0.08)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "hsl(210, 30%, 20%)",
                }}
                formatter={(value: number) => [`${value}/10`, "Dor"]}
              />
              <Area
                type="monotone"
                dataKey="dor"
                stroke="hsl(196, 58%, 42%)"
                strokeWidth={2}
                fill="url(#painGradient)"
                dot={{ r: 4, fill: "hsl(196, 58%, 42%)", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "hsl(196, 58%, 42%)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default SymptomEvolutionChart;
