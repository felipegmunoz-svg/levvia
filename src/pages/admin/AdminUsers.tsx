import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/hooks/use-toast";
import { ShieldCheck, Plus, Trash2, Search, UserCog } from "lucide-react";

interface AdminUser {
  user_id: string;
  role_id: string;
  name: string;
  email: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
}

const AdminUsers = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Get all admin roles
    const { data: roles } = await supabase
      .from("user_roles")
      .select("id, user_id, role")
      .eq("role", "admin");

    const adminRoles = roles || [];
    const adminUserIds = adminRoles.map((r) => r.user_id);

    // Get profiles for admins
    let adminProfiles: AdminUser[] = [];
    if (adminUserIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", adminUserIds);

      adminProfiles = adminRoles.map((r) => {
        const prof = (profs || []).find((p) => p.id === r.user_id);
        return {
          user_id: r.user_id,
          role_id: r.id,
          name: prof?.name || "Sem nome",
          email: prof?.email || "",
        };
      });
    }

    // Get all non-admin profiles for the add dialog
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("id, name, email")
      .order("name");

    const nonAdmins = (allProfiles || []).filter(
      (p) => !adminUserIds.includes(p.id)
    );

    setAdmins(adminProfiles);
    setProfiles(nonAdmins);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!selectedUserId) return;

    const { error } = await supabase.from("user_roles").insert({
      user_id: selectedUserId,
      role: "admin" as const,
    });

    if (error) {
      toast({
        title: "Erro ao adicionar admin",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Administrador adicionado! ✅" });
      setShowAdd(false);
      setSelectedUserId("");
      fetchData();
    }
  };

  const handleRemove = async (admin: AdminUser) => {
    if (!confirm(`Remover ${admin.name} como administrador?`)) return;

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", admin.role_id);

    if (error) {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Administrador removido" });
      fetchData();
    }
  };

  const filtered = admins.filter(
    (a) =>
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Administradores</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os usuários com acesso ao painel administrativo
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/30 border-white/10"
            />
          </div>
          <Button onClick={() => setShowAdd(true)} className="gap-2">
            <Plus size={16} /> Adicionar Admin
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="bg-muted/30 border-white/10 animate-pulse">
                <CardContent className="p-4 h-16" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-muted/30 border-white/10">
            <CardContent className="p-8 text-center">
              <UserCog
                size={48}
                strokeWidth={1}
                className="text-muted-foreground mx-auto mb-3"
              />
              <p className="text-muted-foreground">Nenhum administrador encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((admin) => (
              <Card
                key={admin.role_id}
                className="bg-muted/30 border-white/10"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <ShieldCheck size={18} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {admin.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Admin</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(admin)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Dialog */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="bg-background border-white/10">
            <DialogHeader>
              <DialogTitle>Adicionar Administrador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione um usuário existente para promover a administrador. Ele
                terá acesso completo ao painel de gestão.
              </p>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Usuário
                </label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="bg-muted/30 border-white/10">
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Nenhum usuário disponível
                      </SelectItem>
                    ) : (
                      profiles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name || "Sem nome"} ({p.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAdd}
                disabled={!selectedUserId}
                className="w-full"
              >
                Promover a Administrador
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
