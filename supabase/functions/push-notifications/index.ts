import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Web Push utilities using Web Crypto API
async function importVapidKeys(publicKey: string, privateKey: string) {
  const pubBytes = base64UrlToUint8Array(publicKey);
  const privBytes = base64UrlToUint8Array(privateKey);

  const pubKeyObj = await crypto.subtle.importKey(
    "raw",
    pubBytes.buffer as ArrayBuffer,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );

  const pubJwk = await crypto.subtle.exportKey("jwk", pubKeyObj);
  const { key_ops: _discard, ...pubJwkClean } = pubJwk;
  const privJwk = {
    ...pubJwkClean,
    d: uint8ArrayToBase64Url(privBytes),
  };

  const privateKeyObj = await crypto.subtle.importKey(
    "jwk",
    { ...privJwk, key_ops: ["sign"] },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  return { publicKey: pubKeyObj, privateKey: privateKeyObj };
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

function uint8ArrayToBase64Url(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function createJwt(
  privateKey: CryptoKey,
  audience: string,
  subject: string,
  _vapidPublicKey: string
) {
  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 60 * 60,
    sub: subject,
  };

  const encoder = new TextEncoder();
  const headerB64 = uint8ArrayToBase64Url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = uint8ArrayToBase64Url(encoder.encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    encoder.encode(unsignedToken)
  );

  const sigArray = new Uint8Array(signature);
  const sigB64 = uint8ArrayToBase64Url(sigArray);

  return `${unsignedToken}.${sigB64}`;
}

async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKeyStr: string,
  vapidPrivateKeyStr: string
) {
  try {
    const url = new URL(subscription.endpoint);
    const audience = `${url.protocol}//${url.host}`;

    const keys = await importVapidKeys(vapidPublicKeyStr, vapidPrivateKeyStr);
    const jwt = await createJwt(keys.privateKey, audience, "mailto:contato@levvia.app", vapidPublicKeyStr);

    const payloadBytes = new TextEncoder().encode(payload);

    const response = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        Authorization: `vapid t=${jwt}, k=${vapidPublicKeyStr}`,
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "aes128gcm",
        TTL: "86400",
      },
      body: payloadBytes,
    });

    return { success: response.ok, status: response.status };
  } catch (error) {
    console.error("Push send error:", error);
    return { success: false, error: String(error) };
  }
}

// Motivational messages
const morningMessages = [
  { title: "Bom dia, guerreira! ☀️", body: "Seu checklist de hoje está te esperando. Bora começar?" },
  { title: "Novo dia, nova chance! 🌸", body: "Cada pequeno passo conta. Que tal começar pelos exercícios?" },
  { title: "Acorda, Levvia! 💪", body: "Sua jornada de cuidado continua hoje. Vamos juntas?" },
  { title: "Manhã de autocuidado 🧘", body: "Reserve um momento para você hoje. Seu corpo agradece." },
  { title: "Levvia te lembra 💚", body: "Hidratação, movimento e carinho consigo mesma. Bora?" },
];

const eveningMessages = [
  { title: "Como foi seu dia? 🌙", body: "Não esqueça de marcar o que completou no checklist!" },
  { title: "Hora de reflexão ✨", body: "Cada hábito completado é uma vitória. Celebre o que fez hoje!" },
  { title: "Boa noite, Levvia! 🌜", body: "Amanhã é um novo dia. Descanse bem!" },
  { title: "Checklist noturno 📝", body: "Já marcou seus hábitos de hoje? Abra o app e registre." },
  { title: "Você é incrível 💜", body: "Não importa quantos itens marcou, o que importa é não desistir." },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // GET vapid public key (no auth needed)
    if (action === "vapid-key") {
      return new Response(
        JSON.stringify({ publicKey: vapidPublicKey }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Subscribe: save push subscription
    if (action === "subscribe") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const anonClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await anonClient.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { subscription } = await req.json();
      const keys = subscription.keys;

      const { error } = await supabase
        .from("push_subscriptions")
        .upsert(
          {
            user_id: user.id,
            endpoint: subscription.endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
          },
          { onConflict: "user_id,endpoint" }
        );

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send notifications (admin broadcast)
    if (action === "send") {
      const body = await req.json();
      const { title, message, type = "manual" } = body;

      const { data: subs, error } = await supabase
        .from("push_subscriptions")
        .select("*");

      if (error) throw error;

      let sentCount = 0;
      const payload = JSON.stringify({
        title,
        body: message,
        icon: "/logo_app_livvia.png",
        badge: "/pwa-192x192.png",
        data: { url: "/today" },
      });

      for (const sub of subs || []) {
        const result = await sendPushNotification(sub, payload, vapidPublicKey, vapidPrivateKey);
        if (result.success) sentCount++;
        else if (result.status === 410 || result.status === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }

      await supabase.from("notification_log").insert({
        title,
        body: message,
        type,
        sent_count: sentCount,
      });

      return new Response(
        JSON.stringify({ success: true, sent: sentCount, total: subs?.length || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Smart scheduled notification (called by cron every 30 min)
    if (action === "scheduled") {
      // Get current time in Brazil
      const now = new Date();
      const brTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
      const currentHour = brTime.getHours();
      const currentMinute = brTime.getMinutes();
      const currentTimeStr = `${String(currentHour).padStart(2, "0")}:${currentMinute < 30 ? "00" : "30"}`;

      console.log(`Scheduled check at BR time: ${currentHour}:${String(currentMinute).padStart(2, "0")} (slot: ${currentTimeStr})`);

      // Get all subscriptions with their user preferences
      const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("*");

      if (!subs || subs.length === 0) {
        return new Response(
          JSON.stringify({ skipped: true, reason: "No subscriptions" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get notification preferences for all users with subscriptions
      const userIds = [...new Set(subs.map((s) => s.user_id))];
      const { data: prefs } = await supabase
        .from("notification_preferences")
        .select("*")
        .in("user_id", userIds);

      const prefsMap = new Map((prefs || []).map((p) => [p.user_id, p]));

      // Default preferences for users without settings
      const defaultPrefs = {
        morning_enabled: true,
        evening_enabled: true,
        morning_time: "08:00",
        evening_time: "20:00",
      };

      let totalSent = 0;
      const morningUsers: typeof subs = [];
      const eveningUsers: typeof subs = [];

      for (const sub of subs) {
        const userPref = prefsMap.get(sub.user_id) || defaultPrefs;

        // Check if this user should receive a morning notification now
        if (userPref.morning_enabled && userPref.morning_time === currentTimeStr) {
          morningUsers.push(sub);
        }
        // Check if this user should receive an evening notification now
        if (userPref.evening_enabled && userPref.evening_time === currentTimeStr) {
          eveningUsers.push(sub);
        }
      }

      // Send morning notifications
      if (morningUsers.length > 0) {
        const msg = morningMessages[Math.floor(Math.random() * morningMessages.length)];
        const payload = JSON.stringify({
          title: msg.title,
          body: msg.body,
          icon: "/logo_app_livvia.png",
          badge: "/pwa-192x192.png",
          data: { url: "/today" },
        });

        for (const sub of morningUsers) {
          const result = await sendPushNotification(sub, payload, vapidPublicKey, vapidPrivateKey);
          if (result.success) totalSent++;
          else if (result.status === 410 || result.status === 404) {
            await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          }
        }

        if (morningUsers.length > 0) {
          await supabase.from("notification_log").insert({
            title: msg.title,
            body: msg.body,
            type: "morning",
            sent_count: totalSent,
          });
        }
      }

      // Send evening notifications
      if (eveningUsers.length > 0) {
        const msg = eveningMessages[Math.floor(Math.random() * eveningMessages.length)];
        const payload = JSON.stringify({
          title: msg.title,
          body: msg.body,
          icon: "/logo_app_livvia.png",
          badge: "/pwa-192x192.png",
          data: { url: "/today" },
        });

        let eveningSent = 0;
        for (const sub of eveningUsers) {
          const result = await sendPushNotification(sub, payload, vapidPublicKey, vapidPrivateKey);
          if (result.success) eveningSent++;
          else if (result.status === 410 || result.status === 404) {
            await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          }
        }
        totalSent += eveningSent;

        await supabase.from("notification_log").insert({
          title: msg.title,
          body: msg.body,
          type: "evening",
          sent_count: eveningSent,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          time_slot: currentTimeStr,
          morning_targets: morningUsers.length,
          evening_targets: eveningUsers.length,
          total_sent: totalSent,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Push notification error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
