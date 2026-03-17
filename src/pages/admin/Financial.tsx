import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Users, AlertTriangle } from "lucide-react";
import SubscriptionsList from "@/components/admin/SubscriptionsList";
import PlansManager from "@/components/admin/PlansManager";

interface MetricCard {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
}

const Financial = () => {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data: subs } = await supabase.from("subscriptions").select("*, plans(*)");
      const subscriptions = subs || [];

      const active = subscriptions.filter((s: any) => s.status === "active" || s.status === "trial");
      const canceled = subscriptions.filter((s: any) => s.status === "canceled");
      const pastDue = subscriptions.filter((s: any) => s.status === "past_due");

      // Calculate MRR
      const mrr = active.reduce((acc: number, s: any) => {
        const plan = s.plans;
        if (!plan) return acc;
        const monthlyValue = plan.price_cents / (plan.interval_count || 1);
        return acc + monthlyValue;
      }, 0);

      // Calculate total revenue (all active subscriptions * their price)
      const totalRevenue = subscriptions
        .filter((s: any) => s.status !== "canceled")
        .reduce((acc: number, s: any) => acc + (s.plans?.price_cents || 0), 0);

      const churnRate = subscriptions.length > 0
        ? ((canceled.length / subscriptions.length) * 100).toFixed(1)
        : "0";

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
    } catch (err) {
      console.error("Error fetching financial metrics:", err);
    } finally {
      setLoading(false);
    }
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

        {/* Tabs */}
        <Tabs defaultValue="subscriptions" className="space-y-4">
          <TabsList className="bg-muted/30 border border-white/10">
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <SubscriptionsList onUpdate={fetchMetrics} />
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
