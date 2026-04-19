import api from "./api";

export const registerAPI = async (name, email, password) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const loginAPI = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const getProfileAPI = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};