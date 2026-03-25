import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function usePushNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const isSupported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    setSupported(isSupported);

    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Check if already subscribed
  useEffect(() => {
    if (!supported || !user) return;
    let cancelled = false;

    navigator.serviceWorker.ready.then(async (reg) => {
      if (cancelled) return;
      const sub = await reg.pushManager.getSubscription();
      if (!cancelled) setIsSubscribed(!!sub);
    });

    return () => { cancelled = true; };
  }, [supported, user]);

  const subscribe = useCallback(async () => {
    if (!supported || !user) return false;
    setLoading(true);

    try {
      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setLoading(false);
        return false;
      }

      // Get VAPID public key from edge function
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const vapidRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/push-notifications?action=vapid-key`
      );
      const { publicKey } = await vapidRes.json();

      if (!publicKey) throw new Error("VAPID key not found");

      // Convert VAPID key
      const applicationServerKey = urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer;

      // Subscribe to push
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // Send subscription to backend
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/push-notifications?action=subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ subscription: subscription.toJSON() }),
        }
      );

      setIsSubscribed(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Push subscription error:", error);
      setLoading(false);
      return false;
    }
  }, [supported, user]);

  const unsubscribe = useCallback(async () => {
    if (!supported) return;
    setLoading(true);

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();

        // Remove from database
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);
      }
      setIsSubscribed(false);
    } catch (error) {
      console.error("Push unsubscribe error:", error);
    } finally {
      setLoading(false);
    }
  }, [supported]);

  return {
    supported,
    permission,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}
