import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Bell, Send, Clock, Users } from "lucide-react";

interface NotificationLog {
  id: string;
  title: string;
  body: string;
  type: string;
  sent_count: number;
  created_at: string;
}

const Notifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [subCount, setSubCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [{ count }, { data: logData }] = await Promise.all([
      supabase.from("push_subscriptions").select("*", { count: "exact", head: true }),
      supabase
        .from("notification_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    setSubCount(count || 0);
    setLogs((logData as NotificationLog[]) || []);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({ title: "Preencha título e mensagem", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/push-notifications?action=send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ title, message, type: "manual" }),
        }
      );

      const result = await res.json();

      if (result.success) {
        toast({
          title: "Notificação enviada! 🔔",
          description: `Enviada para ${result.sent} de ${result.total} dispositivos.`,
        });
        setTitle("");
        setMessage("");
        loadData();
      } else {
        throw new Error(result.error || "Erro ao enviar");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const typeLabels: Record<string, string> = {
    manual: "Manual",
    morning: "Manhã",
    evening: "Noite",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Notificações Push</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Envie notificações para engajar suas usuárias
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-4 text-center">
            <Users className="w-5 h-5 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-semibold text-foreground">{subCount}</p>
            <p className="text-xs text-muted-foreground">Inscritas</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <Bell className="w-5 h-5 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-semibold text-foreground">{logs.length}</p>
            <p className="text-xs text-muted-foreground">Enviadas</p>
          </div>
        </div>

        {/* Send form */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-medium text-foreground flex items-center gap-2">
            <Send className="w-4 h-4 text-secondary" />
            Enviar notificação
          </h2>
          <div className="space-y-2">
            <Label htmlFor="notif-title" className="text-foreground">Título</Label>
            <Input
              id="notif-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Hora do checklist! 📝"
              className="bg-white/[0.06] border-white/10 text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notif-msg" className="text-foreground">Mensagem</Label>
            <Textarea
              id="notif-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Não esqueça de cuidar de você hoje..."
              rows={3}
              className="bg-white/[0.06] border-white/10 text-foreground resize-none"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sending}
            className="w-full gradient-primary text-foreground"
          >
            {sending ? "Enviando..." : `Enviar para ${subCount} dispositivos`}
          </Button>
        </div>

        {/* History */}
        <div className="space-y-3">
          <h2 className="text-base font-medium text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            Histórico
          </h2>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma notificação enviada ainda.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="glass-card rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{log.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
                      {typeLabels[log.type] || log.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{log.body}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(log.created_at).toLocaleString("pt-BR")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {log.sent_count} enviadas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
