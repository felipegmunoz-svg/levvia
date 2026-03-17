import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, ArrowUp, ArrowDown, Trash2, BookOpen } from "lucide-react";

interface LearnModule {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  content_paragraphs: string[];
  surprising_fact: string;
  practical_tip: string;
  reflection_question: string;
  icon: string | null;
  sort_order: number | null;
  is_active: boolean | null;
}

const emptyModule: Omit<LearnModule, "id"> = {
  day: 1,
  title: "",
  subtitle: "",
  content_paragraphs: [""],
  surprising_fact: "",
  practical_tip: "",
  reflection_question: "",
  icon: "book-open",
  sort_order: 0,
  is_active: true,
};

const LearnModules = () => {
  const [modules, setModules] = useState<LearnModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LearnModule | null>(null);
  const [form, setForm] = useState(emptyModule);
  const [saving, setSaving] = useState(false);

  const fetchModules = async () => {
    const { data, error } = await supabase
      .from("learn_modules")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setModules(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyModule, day: modules.length + 1, sort_order: modules.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (m: LearnModule) => {
    setEditing(m);
    setForm({
      day: m.day,
      title: m.title,
      subtitle: m.subtitle,
      content_paragraphs: m.content_paragraphs.length ? m.content_paragraphs : [""],
      surprising_fact: m.surprising_fact,
      practical_tip: m.practical_tip,
      reflection_question: m.reflection_question,
      icon: m.icon,
      sort_order: m.sort_order,
      is_active: m.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      day: form.day,
      title: form.title,
      subtitle: form.subtitle,
      content_paragraphs: form.content_paragraphs.filter((p) => p.trim()),
      surprising_fact: form.surprising_fact,
      practical_tip: form.practical_tip,
      reflection_question: form.reflection_question,
      icon: form.icon || "book-open",
      sort_order: form.sort_order ?? 0,
      is_active: form.is_active ?? true,
    };

    if (editing) {
      const { error } = await supabase.from("learn_modules").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      else toast({ title: "Módulo atualizado" });
    } else {
      const { error } = await supabase.from("learn_modules").insert(payload);
      if (error) toast({ title: "Erro ao criar", description: error.message, variant: "destructive" });
      else toast({ title: "Módulo criado" });
    }
    setSaving(false);
    setDialogOpen(false);
    fetchModules();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este módulo?")) return;
    const { error } = await supabase.from("learn_modules").delete().eq("id", id);
    if (error) toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Módulo excluído" });
      fetchModules();
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= modules.length) return;
    const a = modules[index];
    const b = modules[swapIndex];
    await Promise.all([
      supabase.from("learn_modules").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("learn_modules").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    fetchModules();
  };

  const toggleActive = async (m: LearnModule) => {
    await supabase.from("learn_modules").update({ is_active: !m.is_active }).eq("id", m.id);
    fetchModules();
  };

  const addParagraph = () => setForm((f) => ({ ...f, content_paragraphs: [...f.content_paragraphs, ""] }));
  const removeParagraph = (i: number) =>
    setForm((f) => ({ ...f, content_paragraphs: f.content_paragraphs.filter((_, idx) => idx !== i) }));
  const updateParagraph = (i: number, val: string) =>
    setForm((f) => ({ ...f, content_paragraphs: f.content_paragraphs.map((p, idx) => (idx === i ? val : p)) }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen size={24} /> Módulos Educativos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie os conteúdos da aba Aprender ({modules.length} módulos)
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} /> Novo Módulo
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Dia</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="w-20">Ícone</TableHead>
                  <TableHead className="w-20">Ativo</TableHead>
                  <TableHead className="w-28">Ordem</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((m, i) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.day}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{m.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{m.subtitle}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{m.icon}</TableCell>
                    <TableCell>
                      <Switch checked={!!m.is_active} onCheckedChange={() => toggleActive(m)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleReorder(i, "up")} disabled={i === 0}>
                          <ArrowUp size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorder(i, "down")}
                          disabled={i === modules.length - 1}
                        >
                          <ArrowDown size={14} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-destructive">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Dia</Label>
                <Input type="number" value={form.day} onChange={(e) => setForm({ ...form, day: +e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ícone</Label>
                <Input value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="book-open" />
              </div>
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Parágrafos do Conteúdo</Label>
              {form.content_paragraphs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <Textarea
                    value={p}
                    onChange={(e) => updateParagraph(i, e.target.value)}
                    placeholder={`Parágrafo ${i + 1}`}
                    rows={2}
                    className="flex-1"
                  />
                  {form.content_paragraphs.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeParagraph(i)} className="text-destructive shrink-0">
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addParagraph} className="gap-1">
                <Plus size={14} /> Adicionar parágrafo
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Fato Surpreendente</Label>
              <Textarea value={form.surprising_fact} onChange={(e) => setForm({ ...form, surprising_fact: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Dica Prática</Label>
              <Textarea value={form.practical_tip} onChange={(e) => setForm({ ...form, practical_tip: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Pergunta Reflexiva</Label>
              <Textarea value={form.reflection_question} onChange={(e) => setForm({ ...form, reflection_question: e.target.value })} rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>Módulo ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default LearnModules;
