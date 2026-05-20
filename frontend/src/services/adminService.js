import api from "./api";

export const getDashboardStatsAPI = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const getAllUsersAPI = async () => {
  const { data } = await api.get("/admin/users");
  return data;
};

export const getAllOrdersAdminAPI = async () => {
  const { data } = await api.get("/admin/orders");
  return data;
};

export const updateOrderStatusAPI = async (id, orderStatus) => {
  const { data } = await api.put(`/admin/orders/${id}/status`, { orderStatus });
  return data;
};

export const createProductAdminAPI = async (productData) => {
  const { data } = await api.post("/admin/products", productData);
  return data;
};

export const updateProductAdminAPI = async (id, productData) => {
  const { data } = await api.put(`/admin/products/${id}`, productData);
  return data;
};

export const deleteProductAdminAPI = async (id) => {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
};

export const uploadImageAPI = async (formData) => {
  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};