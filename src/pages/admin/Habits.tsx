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
import { Plus, Pencil, Trash2, Search, Heart } from "lucide-react";

interface HabitRow {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  modal_content: string;
  sort_order: number;
  is_active: boolean;
}

const emptyHabit: Omit<HabitRow, "id"> = {
  title: "",
  description: "",
  category: "",
  icon: "heart",
  modal_content: "",
  sort_order: 0,
  is_active: true,
};

const Habits = () => {
  const [items, setItems] = useState<HabitRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HabitRow | null>(null);
  const [form, setForm] = useState(emptyHabit);

  const fetchData = async () => {
    const { data } = await supabase.from("habits").select("*").order("sort_order");
    setItems((data as HabitRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyHabit);
    setDialogOpen(true);
  };

  const openEdit = (item: HabitRow) => {
    setEditing(item);
    setForm(item);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("habits").update(form).eq("id", editing.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("habits").insert(form);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }

    toast({ title: editing ? "Hábito atualizado!" : "Hábito criado!" });
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    await supabase.from("habits").delete().eq("id", id);
    toast({ title: "Hábito excluído" });
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
        <h1 className="text-2xl font-light text-foreground">Hábitos</h1>
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
          <Heart size={48} strokeWidth={1} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum hábito encontrado</p>
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
                <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
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
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editing ? "Editar Hábito" : "Novo Hábito"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Título</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Categoria</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Conteúdo do Modal</Label>
              <Textarea value={form.modal_content} onChange={(e) => setForm({ ...form, modal_content: e.target.value })} rows={4} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
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

export default Habits;
