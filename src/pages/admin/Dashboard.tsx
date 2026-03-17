import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import {
  Users, Dumbbell, UtensilsCrossed, Heart, TrendingUp, Calendar,
  Activity, Bell, BookOpen, ClipboardList, Flame, Target, Percent,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

interface Stats {
  clients: number;
  exercises: number;
  recipes: number;
  habits: number;
}

interface ClientRow {
  created_at: string;
  status: string;
  challenge_start: string | null;
  challenge_progress: Record<string, Record<string, boolean>> | null;
}

type Period = 7 | 30 | 90;

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "7 dias", value: 7 },
  { label: "30 dias", value: 30 },
  { label: "90 dias", value: 90 },
];

const PIE_COLORS = [
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
];

const tooltipStyle = {
  background: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

const axisTick = { fill: "hsl(var(--muted-foreground))", fontSize: 10 };

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

const PeriodSelector = ({ value, onChange }: { value: Period; onChange: (p: Period) => void }) => (
  <div className="flex gap-1.5">
    {PERIOD_OPTIONS.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          value === opt.value
            ? "bg-secondary text-foreground"
            : "bg-white/[0.06] text-muted-foreground border border-white/10 hover:border-secondary/30"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ clients: 0, exercises: 0, recipes: 0, habits: 0 });
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [allSymptoms, setAllSymptoms] = useState<{ user_id: string; created_at: string }[]>([]);
  const [allModules, setAllModules] = useState<{ user_id: string; completed_at: string }[]>([]);
  const [pushSubCount, setPushSubCount] = useState(0);
  const [notifPrefCount, setNotifPrefCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>(7);

  useEffect(() => {
    const fetchAll = async () => {
      const [
        clientsCount, exercisesCount, recipesCount, habitsCount, clientsData,
        symptomsRes, moduleProgressRes,
        pushSubsRes, notifPrefsRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("exercises").select("id", { count: "exact", head: true }),
        supabase.from("recipes").select("id", { count: "exact", head: true }),
        supabase.from("habits").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("created_at, status, challenge_start, challenge_progress"),
        supabase.from("symptom_entries").select("user_id, created_at"),
        supabase.from("user_module_progress").select("user_id, completed_at"),
        supabase.from("push_subscriptions").select("id", { count: "exact", head: true }),
        supabase.from("notification_preferences").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        clients: clientsCount.count ?? 0,
        exercises: exercisesCount.count ?? 0,
        recipes: recipesCount.count ?? 0,
        habits: habitsCount.count ?? 0,
      });
      setClients((clientsData.data as ClientRow[]) || []);
      setAllSymptoms((symptomsRes.data as { user_id: string; created_at: string }[]) || []);
      setAllModules((moduleProgressRes.data as { user_id: string; completed_at: string }[]) || []);
      setPushSubCount(pushSubsRes.count ?? 0);
      setNotifPrefCount(notifPrefsRes.count ?? 0);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const cutoffDate = useMemo(() => daysAgo(period), [period]);
  const cutoffStr = useMemo(() => cutoffDate.toISOString(), [cutoffDate]);

  // Filter clients by period
  const periodClients = useMemo(
    () => clients.filter((c) => new Date(c.created_at) >= cutoffDate),
    [clients, cutoffDate]
  );

  // Symptoms in period
  const periodSymptoms = useMemo(
    () => allSymptoms.filter((s) => s.created_at >= cutoffStr),
    [allSymptoms, cutoffStr]
  );
  const periodSymptomUsers = useMemo(
    () => new Set(periodSymptoms.map((s) => s.user_id)).size,
    [periodSymptoms]
  );

  // Modules in period
  const periodModules = useMemo(
    () => allModules.filter((m) => m.completed_at >= cutoffStr),
    [allModules, cutoffStr]
  );
  const periodModuleUsers = useMemo(
    () => new Set(periodModules.map((m) => m.user_id)).size,
    [periodModules]
  );

  // Signups chart adapts to period
  const signupChart = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = period - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    clients.forEach((c) => {
      const key = c.created_at.slice(0, 10);
      if (key in days) days[key]++;
    });
    // For 30d/90d, aggregate by week if too many points
    if (period > 14) {
      const entries = Object.entries(days);
      const weeklyData: { date: string; Cadastros: number }[] = [];
      for (let i = 0; i < entries.length; i += 7) {
        const chunk = entries.slice(i, i + 7);
        const total = chunk.reduce((s, [, v]) => s + v, 0);
        const startDate = new Date(chunk[0][0]).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        weeklyData.push({ date: startDate, Cadastros: total });
      }
      return weeklyData;
    }
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      Cadastros: count,
    }));
  }, [clients, period]);

  // Challenge progress distribution
  const challengeDistribution = useMemo(() => {
    let none = 0, early = 0, mid = 0, completed = 0;
    clients.forEach((c) => {
      if (!c.challenge_progress) { none++; return; }
      const completedDays = Object.values(c.challenge_progress).filter((day) => {
        const vals = Object.values(day);
        return vals.length > 0 && vals.every(Boolean);
      }).length;
      if (completedDays === 0) none++;
      else if (completedDays < 7) early++;
      else if (completedDays < 14) mid++;
      else completed++;
    });
    return [
      { name: "Sem progresso", value: none },
      { name: "Dias 1-6", value: early },
      { name: "Dias 7-13", value: mid },
      { name: "Completo (14)", value: completed },
    ].filter((d) => d.value > 0);
  }, [clients]);

  // Retention
  const retentionRate = useMemo(() => {
    const started = clients.filter((c) => c.challenge_start).length;
    if (started === 0) return 0;
    const withProgress = clients.filter((c) => {
      if (!c.challenge_start || !c.challenge_progress) return false;
      return Object.values(c.challenge_progress).some((day) => Object.values(day).some(Boolean));
    }).length;
    return Math.round((withProgress / started) * 100);
  }, [clients]);

  const totalClients = stats.clients || 1;

  const engagementCards = [
    { label: "Taxa de Retenção", value: `${retentionRate}%`, icon: Target, color: "text-secondary", desc: "Iniciaram e continuam ativos" },
    { label: `Cadastros (${period}d)`, value: periodClients.length, icon: Users, color: "text-accent", desc: `Novos nos últimos ${period} dias` },
    { label: "Push Ativados", value: pushSubCount, icon: Bell, color: "text-secondary", desc: `${notifPrefCount} com horários configurados` },
    { label: `Diários (${period}d)`, value: periodSymptoms.length, icon: ClipboardList, color: "text-accent", desc: `${periodSymptomUsers} usuárias no período` },
  ];

  const featureUsage = [
    { name: "Diário de Sintomas", users: periodSymptomUsers, entries: periodSymptoms.length, pct: Math.round((periodSymptomUsers / totalClients) * 100) },
    { name: "Módulos Aprender", users: periodModuleUsers, entries: periodModules.length, pct: Math.round((periodModuleUsers / totalClients) * 100) },
    { name: "Push Notifications", users: pushSubCount, entries: notifPrefCount, pct: Math.round((pushSubCount / totalClients) * 100) },
  ];

  const cards = [
    { label: "Clientes", value: stats.clients, icon: Users, color: "text-secondary" },
    { label: "Exercícios", value: stats.exercises, icon: Dumbbell, color: "text-secondary" },
    { label: "Receitas", value: stats.recipes, icon: UtensilsCrossed, color: "text-accent" },
    { label: "Hábitos", value: stats.habits, icon: Heart, color: "text-destructive" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-light text-foreground">Dashboard</h1>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <card.icon size={22} strokeWidth={1.5} className={card.color} />
            </div>
            <p className="text-3xl font-light text-foreground">{loading ? "—" : card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Engagement metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {engagementCards.map((card) => (
          <div key={card.label} className="glass-card p-5 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                <card.icon size={16} strokeWidth={1.5} className={card.color} />
              </div>
            </div>
            <p className="text-2xl font-light text-foreground">{loading ? "—" : card.value}</p>
            <p className="text-xs font-medium text-foreground mt-1">{card.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Signup trend */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} strokeWidth={1.5} className="text-secondary" />
            <h2 className="text-sm font-medium text-foreground">
              Novos cadastros ({period > 14 ? "por semana" : "por dia"})
            </h2>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={signupChart}>
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="Cadastros" stroke="hsl(var(--secondary))" fill="url(#signupGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Challenge distribution pie */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Flame size={18} strokeWidth={1.5} className="text-accent" />
            <h2 className="text-sm font-medium text-foreground">Distribuição do Desafio</h2>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : challengeDistribution.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Sem dados ainda</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={challengeDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke="none">
                    {challengeDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {challengeDistribution.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-medium text-foreground ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature usage */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={18} strokeWidth={1.5} className="text-secondary" />
          <h2 className="text-sm font-medium text-foreground">Uso de Funcionalidades ({period}d)</h2>
        </div>
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {featureUsage.map((feat) => (
              <div key={feat.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{feat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{feat.users} usuárias · {feat.entries} registros</span>
                    <span className="text-xs font-medium text-secondary">{feat.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${Math.min(feat.pct, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status overview */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users size={18} strokeWidth={1.5} className="text-secondary" />
          <h2 className="text-sm font-medium text-foreground">Status dos Clientes</h2>
        </div>
        {!loading && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Ativos", value: clients.filter((c) => c.status === "active").length },
              { name: "Inativos", value: clients.filter((c) => c.status !== "active").length },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-4 bg-white/[0.04] rounded-xl p-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.name === "Ativos" ? "bg-success/20" : "bg-destructive/20"
                }`}>
                  <span className="text-xl font-light text-foreground">{item.value}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {clients.length > 0 ? Math.round((item.value / clients.length) * 100) : 0}% do total
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
