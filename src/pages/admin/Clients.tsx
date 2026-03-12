import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  pain_level: string;
  objective: string;
  created_at: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, name, email, phone, status, pain_level, objective, created_at")
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
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Nível de Dor</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Objetivo</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="border-b border-white/10 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{client.name || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{client.email}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{client.pain_level || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[200px]">
                    {client.objective || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(client.id, client.status)}>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Clients;
