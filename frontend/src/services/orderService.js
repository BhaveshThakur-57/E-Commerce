import api from "./api";

export const createOrderAPI = async (shippingAddress, couponCode = null, discountAmount = 0) => {
  const { data } = await api.post("/orders", {
    shippingAddress,
    couponCode,
    discountAmount,
  });
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

export const cancelOrderAPI = async (id) => {
  const { data } = await api.put(`/orders/${id}/cancel`);
  return data;
};