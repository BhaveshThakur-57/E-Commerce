const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:admin@luxora.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (subscription, payload) => {
  if (!subscription) return;
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error("Push Notification Error:", error);
  }
};

module.exports = { sendPushNotification };
