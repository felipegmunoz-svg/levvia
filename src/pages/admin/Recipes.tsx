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
import { Plus, Pencil, Trash2, Search, UtensilsCrossed } from "lucide-react";

interface RecipeRow {
  id: string;
  title: string;
  tipo_refeicao: string[];
  tags: string[];
  ingredients: string[];
  instructions: string[];
  por_que_resfria: string;
  dica: string;
  category: string;
  time: string;
  servings: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  image_url: string;
}

const emptyRecipe: Omit<RecipeRow, "id"> = {
  title: "",
  tipo_refeicao: [],
  tags: [],
  ingredients: [],
  instructions: [],
  por_que_resfria: "",
  dica: "",
  category: "",
  time: "",
  servings: "",
  description: "",
  icon: "utensils",
  sort_order: 0,
  is_active: true,
  image_url: "",
};

const Recipes = () => {
  const [items, setItems] = useState<RecipeRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RecipeRow | null>(null);
  const [form, setForm] = useState(emptyRecipe);
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [tipoText, setTipoText] = useState("");

  const fetchData = async () => {
    const { data } = await supabase.from("recipes").select("*").order("sort_order");
    setItems((data as RecipeRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyRecipe);
    setIngredientsText("");
    setInstructionsText("");
    setTagsText("");
    setTipoText("");
    setDialogOpen(true);
  };

  const openEdit = (item: RecipeRow) => {
    setEditing(item);
    setForm(item);
    setIngredientsText(item.ingredients.join("\n"));
    setInstructionsText(item.instructions.join("\n"));
    setTagsText(item.tags.join(", "));
    setTipoText(item.tipo_refeicao.join(", "));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      ingredients: ingredientsText.split("\n").filter(Boolean),
      instructions: instructionsText.split("\n").filter(Boolean),
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      tipo_refeicao: tipoText.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editing) {
      const { error } = await supabase.from("recipes").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("recipes").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    }

    toast({ title: editing ? "Receita atualizada!" : "Receita criada!" });
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    await supabase.from("recipes").delete().eq("id", id);
    toast({ title: "Receita excluída" });
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
        <h1 className="text-2xl font-light text-foreground">Receitas</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 bg-white/[0.06] border-white/10 text-foreground" />
          </div>
          <Button onClick={openCreate} className="gradient-primary text-foreground gap-2">
            <Plus size={16} /> Nova
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center">
          <UtensilsCrossed size={48} strokeWidth={1} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma receita encontrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-foreground truncate">{item.title}</h3>
                  {!item.is_active && <Badge variant="secondary">Inativa</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.category} · {item.time} · {item.servings}
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
            <DialogTitle className="text-foreground">{editing ? "Editar Receita" : "Nova Receita"}</DialogTitle>
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
                <Label className="text-foreground">Tempo</Label>
                <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Porções</Label>
                <Input value={form.servings} onChange={(e) => setForm({ ...form, servings: e.target.value })} className="bg-white/[0.06] border-white/10 text-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Tipo de Refeição (separado por vírgula)</Label>
              <Input value={tipoText} onChange={(e) => setTipoText(e.target.value)} placeholder="Café da manhã, Lanche" className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Tags (separadas por vírgula)</Label>
              <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="anti-inflamatório, sem glúten" className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Ingredientes (um por linha)</Label>
              <Textarea value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} rows={5} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Instruções (uma por linha)</Label>
              <Textarea value={instructionsText} onChange={(e) => setInstructionsText(e.target.value)} rows={5} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Por que resfria</Label>
              <Textarea value={form.por_que_resfria} onChange={(e) => setForm({ ...form, por_que_resfria: e.target.value })} rows={2} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Dica</Label>
              <Textarea value={form.dica} onChange={(e) => setForm({ ...form, dica: e.target.value })} rows={2} className="bg-white/[0.06] border-white/10 text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">URL da Imagem</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="bg-white/[0.06] border-white/10 text-foreground" />
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-1" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
                Ativa
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

export default Recipes;
