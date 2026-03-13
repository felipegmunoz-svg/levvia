import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, User, X, Activity, Ruler, Heart, Target, Stethoscope, Flame } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  pain_level: string;
  objective: string;
  created_at: string;
  age: number | null;
  sex: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  activity_level: string | null;
  health_conditions: string[] | null;
  affected_areas: string[] | null;
  challenge_progress: Record<string, Record<string, boolean>> | null;
  challenge_start: string | null;
}

const Clients = () => {
  const [clients, setClients] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setClients((data as Profile[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "active" ? "inactive" : "active";
    await supabase.from("profiles").update({ status: newStatus }).eq("id", id);
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const getBmi = (w: number | null, h: number | null) => {
    if (!w || !h) return null;
    return (w / ((h / 100) ** 2)).toFixed(1);
  };

  const getChallengeDay = (start: string | null) => {
    if (!start) return null;
    const diff = Date.now() - new Date(start).getTime();
    const day = Math.floor(diff / 86400000) + 1;
    return Math.min(Math.max(day, 1), 14);
  };

  const getCompletedDays = (progress: Record<string, Record<string, boolean>> | null) => {
    if (!progress) return 0;
    return Object.values(progress).filter(
      (day) => Object.values(day).length > 0 && Object.values(day).every(Boolean)
    ).length;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-foreground">Clientes</h1>
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            className="pl-9 bg-white/[0.06] border-white/10 text-foreground"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center">
          <User size={48} strokeWidth={1} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Nome</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Idade</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Dor</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Objetivo</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Desafio</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => {
                const challengeDay = getChallengeDay(client.challenge_start);
                const completedDays = getCompletedDays(client.challenge_progress);
                return (
                  <tr
                    key={client.id}
                    className="border-b border-white/10 last:border-0 hover:bg-white/[0.03] cursor-pointer"
                    onClick={() => setSelected(client)}
                  >
                    <td className="px-4 py-3 text-sm text-foreground font-medium">{client.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{client.email}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{client.age || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{client.pain_level || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[150px]">
                      {client.objective || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {challengeDay ? (
                        <span className="text-xs text-secondary">
                          Dia {challengeDay}/14 • {completedDays} completos
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Não iniciado</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(client.id, client.status); }}>
                        <Badge
                          variant={client.status === "active" ? "default" : "secondary"}
                          className={client.status === "active" ? "bg-success/20 text-success hover:bg-success/30" : ""}
                        >
                          {client.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(client.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Client detail modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="bg-background border-white/10 max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-lg font-light">
              {selected?.name || "Cliente"}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6 mt-2">
              {/* Personal info */}
              <section>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User size={14} className="text-secondary" /> Dados Pessoais
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Email", value: selected.email },
                    { label: "Telefone", value: selected.phone || "—" },
                    { label: "Idade", value: selected.age ? `${selected.age} anos` : "—" },
                    { label: "Sexo", value: selected.sex || "—" },
                    { label: "Peso", value: selected.weight_kg ? `${selected.weight_kg} kg` : "—" },
                    { label: "Altura", value: selected.height_cm ? `${selected.height_cm} cm` : "—" },
                    { label: "IMC", value: getBmi(selected.weight_kg, selected.height_cm) || "—" },
                    { label: "Atividade", value: selected.activity_level || "—" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/[0.04] rounded-lg px-3 py-2">
                      <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                      <p className="text-sm text-foreground font-medium truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Health */}
              <section>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Stethoscope size={14} className="text-secondary" /> Saúde
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/[0.04] rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground uppercase">Nível de dor</p>
                    <p className="text-sm text-foreground font-medium">{selected.pain_level || "—"}</p>
                  </div>
                  <div className="bg-white/[0.04] rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground uppercase">Áreas afetadas</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selected.affected_areas?.length ? (
                        selected.affected_areas.map((a) => (
                          <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhuma</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/[0.04] rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground uppercase">Condições de saúde</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selected.health_conditions?.length ? (
                        selected.health_conditions.map((c) => (
                          <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhuma</span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Objective & Challenge */}
              <section>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target size={14} className="text-secondary" /> Objetivo & Desafio
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/[0.04] rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground uppercase">Objetivo principal</p>
                    <p className="text-sm text-foreground font-medium">{selected.objective || "—"}</p>
                  </div>
                  <div className="bg-white/[0.04] rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground uppercase">Progresso do desafio</p>
                    {getChallengeDay(selected.challenge_start) ? (
                      <div className="mt-1">
                        <p className="text-sm text-foreground font-medium">
                          Dia {getChallengeDay(selected.challenge_start)}/14 — {getCompletedDays(selected.challenge_progress)} dias completos
                        </p>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-gradient-to-r from-secondary to-success rounded-full"
                            style={{ width: `${(getCompletedDays(selected.challenge_progress) / 14) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Desafio não iniciado</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Clients;
