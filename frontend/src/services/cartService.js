import api from "./api";

export const getCartAPI = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const addToCartAPI = async (productId, qty = 1) => {
  const { data } = await api.post("/cart", { productId, qty });
  return data;
};

export const updateCartItemAPI = async (productId, qty) => {
  const { data } = await api.put(`/cart/${productId}`, { qty });
  return data;
};

export const removeFromCartAPI = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

export const clearCartAPI = async () => {
  const { data } = await api.delete("/cart/clear");
  return data;
};