import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, Dumbbell } from "lucide-react";

interface ExerciseRow {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  frequency: string;
  description: string;
  start_position: string;
  steps: string[];
  benefits: string;
  safety: string;
  variations: string[];
  icon: string;
  sort_order: number;
  is_active: boolean;
  video_url: string;
}

const emptyExercise: Omit<ExerciseRow, "id"> = {
  title: "",
  category: "",
  level: "Fácil",
  duration: "5 min",
  frequency: "",
  description: "",
  start_position: "",
  steps: [],
  benefits: "",
  safety: "",
  variations: [],
  icon: "dumbbell",
  sort_order: 0,
  is_active: true,
  video_url: "",
};

const Exercises = () => {
  const [items, setItems] = useState<ExerciseRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ExerciseRow | null>(null);
  const [form, setForm] = useState(emptyExercise);
  const [stepsText, setStepsText] = useState("");
  const [variationsText, setVariationsText] = useState("");

  const fetchData = async () => {
    const { data } = await supabase.from("exercises").select("*").order("sort_order");
    setItems((data as ExerciseRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyExercise);
    setStepsText("");
    setVariationsText("");
    setDialogOpen(true);
  };

  const openEdit = (item: ExerciseRow) => {
    setEditing(item);
    setForm(item);
    setStepsText(item.steps.join("\n"));
    setVariationsText(item.variations.join("\n"));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      steps: stepsText.split("\n").filter(Boolean),
      variations: variationsText.split("\n").filter(Boolean),
    };

    if (editing) {
      const { error } = await supabase.from("exercises").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("exercises").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }

    toast({ title: editing ? "Exercício atualizado!" : "Exercício criado!" });
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    await supabase.from("exercises").delete().eq("id", id);
    toast({ title: "Exercício excluído" });
    fetchData();
  };

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-foreground">Exercícios</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 bg-white/[0.06] border-white/10 text-foreground" />
          </div>
          <Button onClick={openCreate} className="gradient-primary text-foreground gap-2">
            <Plus size={16} /> Novo
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center">
          <Dumbbell size={48} strokeWidth={1} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum exercício encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-foreground truncate">{item.title}</h3>
                  {!item.is_active && <Badge variant="secondary">Inativo</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.category} · {item.level} · {item.duration}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                  <Pencil size={16} className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editing ? "Editar Exercício" : "Novo Exercício"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Título</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Categoria</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Nível</Label>
                <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Duração</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Frequência</Label>
                <Input value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Ordem</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="bg-white/[0.06] border-white/10 text-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Posição Inicial</Label>
              <Textarea value={form.start_position} onChange={(e) => setForm({ ...form, start_position: e.target.value })} rows={2} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Passos (um por linha)</Label>
              <Textarea value={stepsText} onChange={(e) => setStepsText(e.target.value)} rows={5} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Benefícios</Label>
              <Textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={2} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Segurança</Label>
              <Textarea value={form.safety || ""} onChange={(e) => setForm({ ...form, safety: e.target.value })} rows={2} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Variações (uma por linha)</Label>
              <Textarea value={variationsText} onChange={(e) => setVariationsText(e.target.value)} rows={3} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded"
                />
                Ativo
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-white/10 text-foreground">Cancelar</Button>
              <Button onClick={handleSave} className="gradient-primary text-foreground">Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Exercises;
