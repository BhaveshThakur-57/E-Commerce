import api from "./api";

export const createRazorpayOrderAPI = async (orderId) => {
  const { data } = await api.post("/payment/create-order", { orderId });
  return data;
};

export const verifyPaymentAPI = async (paymentData) => {
  const { data } = await api.post("/payment/verify", paymentData);
  return data;
};

export const paymentFailedAPI = async (orderId) => {
  const { data } = await api.post("/payment/failed", { orderId });
  return data;
};