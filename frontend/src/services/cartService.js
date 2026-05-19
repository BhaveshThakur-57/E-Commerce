import api from "./api";

export const getCartAPI = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const addToCartAPI = async (productId, qty = 1, size = "", color = "", colorCode = "") => {
  const { data } = await api.post("/cart", { productId, qty, size, color, colorCode });
  return data;
};

export const updateCartItemAPI = async (itemId, qty) => {
  const { data } = await api.put(`/cart/${itemId}`, { qty });
  return data;
};

export const removeFromCartAPI = async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data;
};

export const clearCartAPI = async () => {
  const { data } = await api.delete("/cart/clear");
  return data;
};