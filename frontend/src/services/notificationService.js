import api from "./api";

export const subscribeToPushAPI = async (subscription) => {
  const { data } = await api.post("/notifications/subscribe", { subscription });
  return data;
};
