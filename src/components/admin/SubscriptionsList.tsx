import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, Edit2, Calendar, CreditCard } from "lucide-react";

const paymentMethodMap: Record<string, string> = {
  pix: "Pix",
  credit_card: "Cartão",
  manual: "Manual",
};

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  trial_end: string | null;
  canceled_at: string | null;
  payment_method: string;
  notes: string;
  created_at: string;
  profiles: { name: string; email: string } | null;
  plans: { name: string; slug: string; price_cents: number } | null;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
}

interface Profile {
  id: string;
  name: string;
  email: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Ativa", variant: "default" },
  trial: { label: "Trial", variant: "secondary" },
  canceled: { label: "Cancelada", variant: "destructive" },
  expired: { label: "Expirada", variant: "outline" },
  past_due: { label: "Pendente", variant: "destructive" },
};

const SubscriptionsList = ({ onUpdate }: { onUpdate: () => void }) => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editSub, setEditSub] = useState<Subscription | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Create form state
  const [newUserId, setNewUserId] = useState("");
  const [newPlanId, setNewPlanId] = useState("");
  const [newStatus, setNewStatus] = useState("active");
  const [newNotes, setNewNotes] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("manual");

  // Edit form state
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editPlanId, setEditPlanId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [subsRes, plansRes, profilesRes, adminRolesRes] = await Promise.all([
      supabase.from("subscriptions").select("*, profiles(name, email), plans(name, slug, price_cents)").order("created_at", { ascending: false }),
      supabase.from("plans").select("id, name, slug, price_cents").eq("is_active", true).order("sort_order"),
      supabase.from("profiles").select("id, name, email").order("name"),
      supabase.from("user_roles").select("user_id").eq("role", "admin"),
    ]);

    const adminIds = (adminRolesRes.data || []).map((r) => r.user_id);
    const filteredProfiles = (profilesRes.data || []).filter((p) => !adminIds.includes(p.id));

    setSubs((subsRes.data as any[]) || []);
    setPlans((plansRes.data as any[]) || []);
    setProfiles(filteredProfiles);
    setLoading(false);
  };

  const filtered = subs.filter((s) => {
    const matchSearch =
      !search ||
      s.profiles?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.profiles?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async () => {
    if (!newUserId || !newPlanId) return;

    const plan = plans.find((p) => p.id === newPlanId);
    const now = new Date();
    const periodEnd = new Date(now);

    if (plan?.slug === "monthly") periodEnd.setMonth(periodEnd.getMonth() + 1);
    else if (plan?.slug === "quarterly") periodEnd.setMonth(periodEnd.getMonth() + 3);
    else periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    const trialEnd = newStatus === "trial" ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : null;

    const { error } = await supabase.from("subscriptions").insert({
      user_id: newUserId,
      plan_id: newPlanId,
      status: newStatus,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      trial_end: trialEnd,
      notes: newNotes,
      payment_method: newPaymentMethod,
    });

    if (error) {
      toast({ title: "Erro ao criar assinatura", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Assinatura criada com sucesso! ✅" });
      setShowCreate(false);
      setNewUserId("");
      setNewPlanId("");
      setNewStatus("active");
      setNewNotes("");
      setNewPaymentMethod("manual");
      fetchData();
      onUpdate();
    }
  };

  const handleUpdate = async () => {
    if (!editSub) return;

    const updates: any = {
      status: editStatus,
      notes: editNotes,
      plan_id: editPlanId,
      updated_at: new Date().toISOString(),
    };

    if (editStatus === "canceled") updates.canceled_at = new Date().toISOString();

    const { error } = await supabase.from("subscriptions").update(updates).eq("id", editSub.id);

    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Assinatura atualizada! ✅" });
      setEditSub(null);
      fetchData();
      onUpdate();
    }
  };

  const openEdit = (sub: Subscription) => {
    setEditSub(sub);
    setEditStatus(sub.status);
    setEditNotes(sub.notes || "");
    setEditPlanId(sub.plan_id);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  const formatPrice = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30 border-white/10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-muted/30 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="past_due">Pendentes</SelectItem>
            <SelectItem value="canceled">Canceladas</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus size={16} /> Nova Assinatura
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-muted/30 border-white/10 animate-pulse">
              <CardContent className="p-4 h-16" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-muted/30 border-white/10">
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma assinatura encontrada
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((sub) => {
            const st = statusMap[sub.status] || { label: sub.status, variant: "outline" as const };
            return (
              <Card
                key={sub.id}
                className="bg-muted/30 border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => openEdit(sub)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {sub.profiles?.name || "Sem nome"}
                      </p>
                      <p className="text-xs text-muted-foreground">{sub.profiles?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-foreground">{sub.plans?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.plans ? formatPrice(sub.plans.price_cents) : "—"}
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={12} />
                        <span>até {formatDate(sub.current_period_end)}</span>
                      </div>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                    <Edit2 size={14} className="text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-background border-white/10">
          <DialogHeader>
            <DialogTitle>Nova Assinatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
              <Select value={newUserId} onValueChange={setNewUserId}>
                <SelectTrigger className="bg-muted/30 border-white/10">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Plano</label>
              <Select value={newPlanId} onValueChange={setNewPlanId}>
                <SelectTrigger className="bg-muted/30 border-white/10">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {formatPrice(p.price_cents)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="bg-muted/30 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Método de Pagamento</label>
              <Select value={newPaymentMethod} onValueChange={setNewPaymentMethod}>
                <SelectTrigger className="bg-muted/30 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Observações</label>
              <Textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="bg-muted/30 border-white/10"
                placeholder="Notas internas..."
              />
            </div>
            <Button onClick={handleCreate} className="w-full">
              Criar Assinatura
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editSub} onOpenChange={(o) => !o && setEditSub(null)}>
        <DialogContent className="bg-background border-white/10">
          <DialogHeader>
            <DialogTitle>Editar Assinatura</DialogTitle>
          </DialogHeader>
          {editSub && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-white/10">
                <p className="text-sm font-medium text-foreground">{editSub.profiles?.name}</p>
                <p className="text-xs text-muted-foreground">{editSub.profiles?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Criada em {formatDate(editSub.created_at)}
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Plano</label>
                <Select value={editPlanId} onValueChange={setEditPlanId}>
                  <SelectTrigger className="bg-muted/30 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {formatPrice(p.price_cents)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="bg-muted/30 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="past_due">Pendente</SelectItem>
                    <SelectItem value="canceled">Cancelada</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Observações</label>
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="bg-muted/30 border-white/10"
                />
              </div>
              <Button onClick={handleUpdate} className="w-full">
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsList;
