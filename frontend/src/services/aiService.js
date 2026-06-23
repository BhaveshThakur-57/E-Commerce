import api from "./api";

export const generateDescriptionAPI = async (name, category, price) => {
  const { data } = await api.post("/ai/description", { name, category, price });
  return data;
};

export const smartSearchAPI = async (query) => {
  const { data } = await api.get(`/ai/search?q=${encodeURIComponent(query)}`);
  return data;
};

export const getRecommendationsAPI = async (productId) => {
  const { data } = await api.get(`/ai/recommendations/${productId}`);
  return data;
};

export const predictSizeAPI = async (sizeData) => {
  const { data } = await api.post("/ai/size-predict", sizeData);
  return data;
};