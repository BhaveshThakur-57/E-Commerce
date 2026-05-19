import api from "./api";

export const validateCouponAPI = async (code, orderAmount) => {
  const { data } = await api.post("/coupons/validate", { code, orderAmount });
  return data;
};