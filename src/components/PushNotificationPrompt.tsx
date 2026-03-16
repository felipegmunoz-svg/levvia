import { Bell, BellOff, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "@/hooks/use-toast";

const PushNotificationPrompt = () => {
  const { supported, permission, isSubscribed, loading, subscribe, unsubscribe } =
    usePushNotifications();

  if (!supported) return null;

  // Don't show if already subscribed
  if (isSubscribed) return null;

  // Don't show if permanently denied
  if (permission === "denied") return null;

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      toast({
        title: "Notificações ativadas! 🔔",
        description: "Você receberá lembretes para cuidar de você.",
      });
    } else if (permission === "denied") {
      toast({
        title: "Notificações bloqueadas",
        description: "Ative nas configurações do navegador para receber lembretes.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="glass-card rounded-2xl p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
          <BellRing className="w-5 h-5 text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Ative as notificações</p>
          <p className="text-xs text-muted-foreground">
            Receba lembretes diários de cuidado
          </p>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="shrink-0 px-4 py-2 rounded-xl gradient-primary text-foreground text-xs font-medium disabled:opacity-50"
        >
          {loading ? "..." : "Ativar"}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default PushNotificationPrompt;
