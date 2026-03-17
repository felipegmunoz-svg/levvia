import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import SubscriptionsList from "@/components/admin/SubscriptionsList";
import PlansManager from "@/components/admin/PlansManager";

interface Sub {
  id: string;
  status: string;
  created_at: string;
  canceled_at: string | null;
  plans: { name: string; price_cents: number; interval_count: number } | null;
}

interface MetricCard {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
}

const PERIOD_OPTIONS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

const Financial = () => {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [subscriptions, setSubscriptions] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("id, status, created_at, canceled_at, plans(name, price_cents, interval_count)")
        .order("created_at");
      const all = (subs as any[]) || [];
      setSubscriptions(all);
      computeMetrics(all);
    } catch (err) {
      console.error("Error fetching financial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const computeMetrics = (all: Sub[]) => {
    const active = all.filter((s) => s.status === "active" || s.status === "trial");
    const canceled = all.filter((s) => s.status === "canceled");
    const pastDue = all.filter((s) => s.status === "past_due");

    const mrr = active.reduce((acc, s) => {
      if (!s.plans) return acc;
      return acc + s.plans.price_cents / (s.plans.interval_count || 1);
    }, 0);

    const totalRevenue = all
      .filter((s) => s.status !== "canceled")
      .reduce((acc, s) => acc + (s.plans?.price_cents || 0), 0);

    const churnRate = all.length > 0 ? ((canceled.length / all.length) * 100).toFixed(1) : "0";

    setMetrics([
      {
        title: "MRR",
        value: `R$ ${(mrr / 100).toFixed(2).replace(".", ",")}`,
        subtitle: "Receita mensal recorrente",
        icon: <DollarSign size={20} className="text-success" />,
      },
      {
        title: "Assinantes Ativos",
        value: String(active.length),
        subtitle: `${pastDue.length} pendente${pastDue.length !== 1 ? "s" : ""}`,
        icon: <Users size={20} className="text-secondary" />,
      },
      {
        title: "Receita Total",
        value: `R$ ${(totalRevenue / 100).toFixed(2).replace(".", ",")}`,
        subtitle: "Todas as assinaturas",
        icon: <TrendingUp size={20} className="text-accent" />,
      },
      {
        title: "Churn Rate",
        value: `${churnRate}%`,
        subtitle: `${canceled.length} cancelamento${canceled.length !== 1 ? "s" : ""}`,
        icon: <AlertTriangle size={20} className="text-destructive" />,
      },
    ]);
  };

  // Build chart data based on selected period
  const { revenueData, subscribersData } = useMemo(() => {
    const today = new Date();
    const days: string[] = [];
    for (let i = period - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    const revenueData = days.map((day) => {
      const daySubs = subscriptions.filter(
        (s) => s.created_at.slice(0, 10) === day && s.status !== "canceled"
      );
      const revenue = daySubs.reduce((acc, s) => acc + (s.plans?.price_cents || 0), 0) / 100;
      return {
        date: new Date(day).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        receita: revenue,
      };
    });

    const subscribersData = days.map((day) => {
      const activeByDay = subscriptions.filter((s) => {
        const created = s.created_at.slice(0, 10);
        if (created > day) return false;
        if (s.status === "canceled" && s.canceled_at && s.canceled_at.slice(0, 10) <= day) return false;
        return true;
      });
      return {
        date: new Date(day).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        ativos: activeByDay.length,
      };
    });

    return { revenueData, subscribersData };
  }, [subscriptions, period]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-background border border-white/10 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm font-medium text-foreground">
            {entry.name === "receita" ? `R$ ${entry.value.toFixed(2).replace(".", ",")}` : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie assinaturas, planos e métricas financeiras
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-muted/30 border-white/10 animate-pulse">
                  <CardContent className="p-5 h-24" />
                </Card>
              ))
            : metrics.map((m) => (
                <Card key={m.title} className="bg-muted/30 border-white/10">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {m.title}
                      </span>
                      {m.icon}
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{m.value}</p>
                    {m.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{m.subtitle}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Charts */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue chart */}
            <Card className="bg-muted/30 border-white/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={16} className="text-success" />
                  <h3 className="text-sm font-medium text-foreground">Receita (30 dias)</h3>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `R$${v}`}
                        width={50}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="receita"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        fill="url(#revenueGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Subscribers chart */}
            <Card className="bg-muted/30 border-white/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-secondary" />
                  <h3 className="text-sm font-medium text-foreground">Assinantes Ativos (30 dias)</h3>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subscribersData}>
                      <defs>
                        <linearGradient id="subsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="ativos"
                        fill="url(#subsGrad)"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="subscriptions" className="space-y-4">
          <TabsList className="bg-muted/30 border border-white/10">
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <SubscriptionsList onUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="plans">
            <PlansManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Financial;
