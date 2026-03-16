// Custom push notification handler for PWA service worker
self.addEventListener("push", (event) => {
  let data = { title: "Levvia", body: "Você tem uma nova mensagem!" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/logo_app_livvia.png",
    badge: data.badge || "/pwa-192x192.png",
    vibrate: [100, 50, 100],
    data: data.data || { url: "/today" },
    actions: [
      { action: "open", title: "Abrir Levvia" },
      { action: "close", title: "Fechar" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const urlToOpen = event.notification.data?.url || "/today";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});
