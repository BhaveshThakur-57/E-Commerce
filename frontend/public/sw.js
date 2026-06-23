self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "LUXORA Update";
  const options = {
    body: data.body || "You have a new notification from LUXORA.",
    icon: "/vite.svg", // Replace with your logo
    badge: "/vite.svg",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus().then(() => {
          if (event.notification.data.url) {
            client.navigate(event.notification.data.url);
          }
        });
      }
      return clients.openWindow(event.notification.data.url || "/");
    })
  );
});
