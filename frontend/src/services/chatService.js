import api from "./api";

export const sendMessageAPI = async (message) => {
  const { data } = await api.post("/chat", { message });
  return data;
};