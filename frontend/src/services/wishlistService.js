import api from "./api";

export const getWishlistAPI = async () => {
  const { data } = await api.get("/wishlist");
  return data;
};

export const toggleWishlistAPI = async (productId) => {
  const { data } = await api.post(`/wishlist/${productId}`);
  return data;
};

export const removeFromWishlistAPI = async (productId) => {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data;
};