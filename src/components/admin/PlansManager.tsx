import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit2, Package } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  interval: string;
  interval_count: number;
  trial_days: number;
  is_active: boolean;
  features: string[];
  sort_order: number;
}

const intervalLabels: Record<string, string> = {
  month: "mês",
  quarter: "trimestre",
  year: "ano",
};

const PlansManager = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formInterval, setFormInterval] = useState("month");
  const [formIntervalCount, setFormIntervalCount] = useState("1");
  const [formTrialDays, setFormTrialDays] = useState("7");
  const [formFeatures, setFormFeatures] = useState("");
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("plans")
      .select("*")
      .order("sort_order");
    setPlans((data as any[]) || []);
    setLoading(false);
  };

  const resetForm = () => {
    setFormName("");
    setFormSlug("");
    setFormPrice("");
    setFormInterval("month");
    setFormIntervalCount("1");
    setFormTrialDays("7");
    setFormFeatures("");
    setFormActive(true);
  };

  const openEdit = (plan: Plan) => {
    setEditPlan(plan);
    setFormName(plan.name);
    setFormSlug(plan.slug);
    setFormPrice((plan.price_cents / 100).toFixed(2).replace(".", ","));
    setFormInterval(plan.interval);
    setFormIntervalCount(String(plan.interval_count));
    setFormTrialDays(String(plan.trial_days));
    setFormFeatures(plan.features.join("\n"));
    setFormActive(plan.is_active);
  };

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  const parsePriceToCents = (price: string): number => {
    const cleaned = price.replace(/[^\d,]/g, "").replace(",", ".");
    return Math.round(parseFloat(cleaned) * 100);
  };

  const handleSave = async () => {
    const priceCents = parsePriceToCents(formPrice);
    if (!formName || !formSlug || isNaN(priceCents)) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const payload = {
      name: formName,
      slug: formSlug,
      price_cents: priceCents,
      interval: formInterval,
      interval_count: parseInt(formIntervalCount) || 1,
      trial_days: parseInt(formTrialDays) || 0,
      features: formFeatures.split("\n").map((f) => f.trim()).filter(Boolean),
      is_active: formActive,
      updated_at: new Date().toISOString(),
    };

    if (editPlan) {
      const { error } = await supabase.from("plans").update(payload).eq("id", editPlan.id);
      if (error) {
        toast({ title: "Erro ao atualizar plano", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Plano atualizado! ✅" });
        setEditPlan(null);
        fetchPlans();
      }
    } else {
      const { error } = await supabase.from("plans").insert({ ...payload, sort_order: plans.length + 1 });
      if (error) {
        toast({ title: "Erro ao criar plano", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Plano criado! ✅" });
        setShowCreate(false);
        fetchPlans();
      }
    }
  };

  const formatPrice = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;

  const formContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nome</label>
          <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="bg-muted/30 border-white/10" placeholder="Ex: Mensal" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Slug</label>
          <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="bg-muted/30 border-white/10" placeholder="Ex: monthly" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Preço (R$)</label>
          <Input value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="bg-muted/30 border-white/10" placeholder="29,90" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Intervalo</label>
          <select
            value={formInterval}
            onChange={(e) => setFormInterval(e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-muted/30 border border-white/10 text-sm text-foreground"
          >
            <option value="month">Mês</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Ano</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Trial (dias)</label>
          <Input value={formTrialDays} onChange={(e) => setFormTrialDays(e.target.value)} className="bg-muted/30 border-white/10" type="number" />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Funcionalidades (uma por linha)</label>
        <textarea
          value={formFeatures}
          onChange={(e) => setFormFeatures(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-muted/30 border border-white/10 text-sm text-foreground min-h-[100px] resize-none"
          placeholder="Plano alimentar personalizado&#10;Exercícios adaptados"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm text-foreground">Ativo</label>
        <Switch checked={formActive} onCheckedChange={setFormActive} />
      </div>
      <Button onClick={handleSave} className="w-full">
        {editPlan ? "Salvar Alterações" : "Criar Plano"}
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Novo Plano
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-muted/30 border-white/10 animate-pulse">
              <CardContent className="p-4 h-20" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="bg-muted/30 border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              onClick={() => openEdit(plan)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Package size={18} className="text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{plan.name}</p>
                      {!plan.is_active && <Badge variant="outline">Inativo</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(plan.price_cents)}/{intervalLabels[plan.interval] || plan.interval}
                      {plan.trial_days > 0 && ` • ${plan.trial_days} dias trial`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">
                      {plan.features.length} funcionalidade{plan.features.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Edit2 size={14} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-background border-white/10">
          <DialogHeader>
            <DialogTitle>Novo Plano</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editPlan} onOpenChange={(o) => !o && setEditPlan(null)}>
        <DialogContent className="bg-background border-white/10">
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManager;
