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

// Coupons
export const getAllCouponsAPI = async () => {
  const { data } = await api.get("/coupons");
  return data;
};

export const createCouponAPI = async (couponData) => {
  const { data } = await api.post("/coupons", couponData);
  return data;
};

export const updateCouponAPI = async (id, couponData) => {
  const { data } = await api.put(`/coupons/${id}`, couponData);
  return data;
};

export const deleteCouponAPI = async (id) => {
  const { data } = await api.delete(`/coupons/${id}`);
  return data;
};

// ============ Settings (CMS) ============
export const getSettingsAPI = async () => {
  const { data } = await api.get("/admin/settings");
  return data;
};

export const updateAnnouncementAPI = async (announcementData) => {
  const { data } = await api.put("/admin/settings/announcement", announcementData);
  return data;
};

export const updateBannersAPI = async (banners) => {
  const { data } = await api.put("/admin/settings/banners", { banners });
  return data;
};

export const updatePageContentAPI = async (page, content) => {
  const { data } = await api.put(`/admin/settings/pages/${page}`, { content });
  return data;
};

// ============ Inquiries ============
export const getAllInquiriesAPI = async () => {
  const { data } = await api.get("/admin/inquiries");
  return data;
};

export const getInquiryByIdAPI = async (id) => {
  const { data } = await api.get(`/admin/inquiries/${id}`);
  return data;
};

export const replyToInquiryAPI = async (id, reply) => {
  const { data } = await api.put(`/admin/inquiries/${id}/reply`, { reply });
  return data;
};

export const updateInquiryStatusAPI = async (id, status) => {
  const { data } = await api.put(`/admin/inquiries/${id}/status`, { status });
  return data;
};

export const deleteInquiryAPI = async (id) => {
  const { data } = await api.delete(`/admin/inquiries/${id}`);
  return data;
};

// ============ Bulk Operations ============
export const bulkUpdateStockAPI = async (updates) => {
  const { data } = await api.put("/admin/products/bulk-stock", { updates });
  return data;
};

export const bulkUploadProductsAPI = async (products) => {
  const { data } = await api.post("/admin/products/bulk", { products });
  return data;
};

export const exportOrdersAPI = async () => {
  const { data } = await api.get("/admin/orders/export");
  return data;
};