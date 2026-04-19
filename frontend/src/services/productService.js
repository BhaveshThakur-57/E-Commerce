import api from "./api";

export const getProductsAPI = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const getProductByIdAPI = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProductAPI = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProductAPI = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProductAPI = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};