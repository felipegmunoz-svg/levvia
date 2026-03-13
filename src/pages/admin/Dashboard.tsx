import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Users, Dumbbell, UtensilsCrossed, Heart, TrendingUp, Calendar, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

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

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ clients: 0, exercises: 0, recipes: 0, habits: 0 });
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [clientsCount, exercisesCount, recipesCount, habitsCount, clientsData] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("exercises").select("id", { count: "exact", head: true }),
        supabase.from("recipes").select("id", { count: "exact", head: true }),
        supabase.from("habits").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("created_at, status, challenge_start, challenge_progress"),
      ]);
      setStats({
        clients: clientsCount.count ?? 0,
        exercises: exercisesCount.count ?? 0,
        recipes: recipesCount.count ?? 0,
        habits: habitsCount.count ?? 0,
      });
      setClients((clientsData.data as ClientRow[]) || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Signups per day (last 14 days)
  const signupChart = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days[key] = 0;
    }
    clients.forEach((c) => {
      const key = c.created_at.slice(0, 10);
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      Cadastros: count,
    }));
  }, [clients]);

  // Engagement: clients with active challenge
  const engagementData = useMemo(() => {
    const activeChallenge = clients.filter((c) => c.challenge_start).length;
    const withProgress = clients.filter((c) => {
      if (!c.challenge_progress) return false;
      return Object.values(c.challenge_progress).some((day) => Object.values(day).some(Boolean));
    }).length;
    const completed = clients.filter((c) => {
      if (!c.challenge_progress) return false;
      const completedDays = Object.values(c.challenge_progress).filter((day) => {
        const vals = Object.values(day);
        return vals.length > 0 && vals.every(Boolean);
      }).length;
      return completedDays >= 14;
    }).length;

    return [
      { name: "Desafio ativo", value: activeChallenge },
      { name: "Com progresso", value: withProgress },
      { name: "Completaram", value: completed },
    ];
  }, [clients]);

  // Active vs Inactive
  const statusData = useMemo(() => {
    const active = clients.filter((c) => c.status === "active").length;
    const inactive = clients.length - active;
    return [
      { name: "Ativos", value: active },
      { name: "Inativos", value: inactive },
    ];
  }, [clients]);

  const cards = [
    { label: "Clientes", value: stats.clients, icon: Users, color: "text-secondary" },
    { label: "Exercícios", value: stats.exercises, icon: Dumbbell, color: "text-secondary" },
    { label: "Receitas", value: stats.recipes, icon: UtensilsCrossed, color: "text-accent" },
    { label: "Hábitos", value: stats.habits, icon: Heart, color: "text-destructive" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-light text-foreground mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon size={24} strokeWidth={1.5} className={card.color} />
            </div>
            <p className="text-3xl font-light text-foreground">
              {loading ? "—" : card.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Signup trend */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} strokeWidth={1.5} className="text-secondary" />
            <h2 className="text-sm font-medium text-foreground">Novos cadastros (14 dias)</h2>
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
                <XAxis
                  dataKey="date"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Cadastros"
                  stroke="hsl(var(--secondary))"
                  fill="url(#signupGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Engagement */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} strokeWidth={1.5} className="text-accent" />
            <h2 className="text-sm font-medium text-foreground">Engajamento no Desafio</h2>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engagementData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Status overview */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users size={18} strokeWidth={1.5} className="text-secondary" />
          <h2 className="text-sm font-medium text-foreground">Status dos Clientes</h2>
        </div>
        {!loading && (
          <div className="grid grid-cols-2 gap-4">
            {statusData.map((item) => (
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
