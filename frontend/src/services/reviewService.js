import api from "./api";

export const getProductReviewsAPI = async (productId) => {
  const { data } = await api.get(`/reviews/${productId}`);
  return data;
};

export const addReviewAPI = async (productId, reviewData) => {
  const { data } = await api.post(`/reviews/${productId}`, reviewData);
  return data;
};

export const deleteReviewAPI = async (reviewId) => {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
};