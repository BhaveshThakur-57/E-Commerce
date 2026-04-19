import api from "./api";

export const createOrderAPI = async (shippingAddress) => {
  const { data } = await api.post("/orders", { shippingAddress });
  return data;
};

export const getMyOrdersAPI = async () => {
  const { data } = await api.get("/orders/myorders");
  return data;
};

export const getOrderByIdAPI = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};