import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Bell, BellOff, Clock, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const timeOptions = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00",
];

const eveningTimeOptions = [
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

const NotificationSettings = () => {
  const { user } = useAuth();
  const { supported, isSubscribed, subscribe, unsubscribe, loading: pushLoading } = usePushNotifications();
  const [morningEnabled, setMorningEnabled] = useState(true);
  const [eveningEnabled, setEveningEnabled] = useState(true);
  const [morningTime, setMorningTime] = useState("08:00");
  const [eveningTime, setEveningTime] = useState("20:00");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setMorningEnabled(data.morning_enabled);
        setEveningEnabled(data.evening_enabled);
        setMorningTime(data.morning_time);
        setEveningTime(data.evening_time);
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const payload = {
      user_id: user.id,
      morning_enabled: morningEnabled,
      evening_enabled: eveningEnabled,
      morning_time: morningTime,
      evening_time: eveningTime,
      timezone: "America/Sao_Paulo",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("notification_preferences")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Preferências salvas! ✅" });
    }
    setSaving(false);
  };

  const handleTogglePush = async () => {
    if (isSubscribed) {
      await unsubscribe();
      toast({ title: "Notificações desativadas" });
    } else {
      const ok = await subscribe();
      if (ok) {
        toast({ title: "Notificações ativadas! 🔔" });
        // Auto-save default preferences
        if (user) {
          await supabase.from("notification_preferences").upsert({
            user_id: user.id,
            morning_enabled: true,
            evening_enabled: true,
            morning_time: "08:00",
            evening_time: "20:00",
            timezone: "America/Sao_Paulo",
          }, { onConflict: "user_id" });
        }
      }
    }
  };

  if (!supported) {
    return (
      <div className="glass-card p-4 text-center">
        <BellOff size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Notificações push não são suportadas neste navegador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Push toggle */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Bell size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Notificações Push</p>
              <p className="text-xs text-muted-foreground">
                {isSubscribed ? "Ativadas neste dispositivo" : "Desativadas"}
              </p>
            </div>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleTogglePush}
            disabled={pushLoading}
          />
        </div>
      </motion.div>

      {/* Time preferences - only show if subscribed */}
      {isSubscribed && loaded && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 space-y-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-secondary" />
            <h3 className="text-sm font-medium text-foreground">Horários preferidos</h3>
          </div>

          {/* Morning */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-amber-400" />
                <Label className="text-sm text-foreground">Lembrete matinal</Label>
              </div>
              <Switch checked={morningEnabled} onCheckedChange={setMorningEnabled} />
            </div>
            {morningEnabled && (
              <div className="flex gap-2 flex-wrap pl-6">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setMorningTime(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      morningTime === t
                        ? "bg-secondary text-foreground"
                      : "bg-white/[0.08] text-muted-foreground border border-white/[0.12] hover:border-secondary/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Evening */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon size={16} className="text-indigo-400" />
                <Label className="text-sm text-foreground">Lembrete noturno</Label>
              </div>
              <Switch checked={eveningEnabled} onCheckedChange={setEveningEnabled} />
            </div>
            {eveningEnabled && (
              <div className="flex gap-2 flex-wrap pl-6">
                {eveningTimeOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setEveningTime(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      eveningTime === t
                        ? "bg-secondary text-foreground"
                        : "bg-white/[0.08] text-muted-foreground border border-white/[0.12] hover:border-secondary/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full" size="sm">
            {saving ? "Salvando..." : "Salvar preferências"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationSettings;
