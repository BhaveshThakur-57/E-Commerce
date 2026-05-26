import { useState, useEffect } from "react";
import { getAllCouponsAPI, createCouponAPI, updateCouponAPI, deleteCouponAPI } from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";
import Loader from "../../components/Loader";
import { Ticket, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    expiresAt: "",
    usageLimit: ""
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await getAllCouponsAPI();
      setCoupons(data);
    } catch (error) {
      alert("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCouponAPI(formData);
      alert("Coupon created successfully");
      setShowModal(false);
      setFormData({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: "0", maxDiscount: "", expiresAt: "", usageLimit: "" });
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create coupon");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateCouponAPI(id, { isActive: !currentStatus });
      alert("Coupon status updated");
      fetchCoupons();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCouponAPI(id);
      alert("Coupon deleted");
      fetchCoupons();
    } catch (error) {
      alert("Failed to delete coupon");
    }
  };

  if (loading) return <div className="pt-28"><Loader text="Loading coupons..." /></div>;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-8 max-w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <Ticket size={28} className="text-brand-500" />
              Coupons
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Manage discount codes and promotions</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Create Coupon
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="inline-block bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
                  <span className="font-mono font-bold tracking-wider text-brand-500">{coupon.code}</span>
                </div>
                <button 
                  onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${
                    coupon.isActive 
                      ? "bg-green-100 text-green-600 hover:bg-green-200" 
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  {coupon.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {coupon.isActive ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-3xl font-bold font-display">
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} OFF
                </p>
                <p className="text-sm text-zinc-500 flex flex-col gap-1">
                  <span>Min Order: ₹{coupon.minOrderAmount}</span>
                  {coupon.maxDiscount && <span>Max Discount: ₹{coupon.maxDiscount}</span>}
                  {coupon.usageLimit && <span>Used: {coupon.usedCount} / {coupon.usageLimit}</span>}
                  {coupon.expiresAt && <span className={new Date(coupon.expiresAt) < new Date() ? "text-red-500" : ""}>
                    Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                  </span>}
                </p>
              </div>

              <button 
                onClick={() => handleDelete(coupon._id)}
                className="absolute bottom-4 right-4 text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {coupons.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500">
              <Ticket size={48} className="mx-auto mb-4 opacity-20" />
              <p>No coupons found. Create one to start offering discounts!</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-in">
              <h2 className="text-2xl font-bold mb-6 font-display">Create New Coupon</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Coupon Code</label>
                  <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full input-field font-mono uppercase" placeholder="e.g. SUMMER50" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Discount Type</label>
                    <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full input-field bg-white dark:bg-zinc-900">
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Discount Value</label>
                    <input type="number" required min="1" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} className="w-full input-field" placeholder="e.g. 20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Min Order (₹)</label>
                    <input type="number" min="0" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} className="w-full input-field" />
                  </div>
                  {formData.discountType === "percentage" && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Max Discount (₹)</label>
                      <input type="number" min="0" value={formData.maxDiscount} onChange={e => setFormData({...formData, maxDiscount: e.target.value})} className="w-full input-field" placeholder="Optional" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Usage Limit</label>
                    <input type="number" min="1" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})} className="w-full input-field" placeholder="e.g. 100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">Expiry Date</label>
                    <input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full input-field" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-outline">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCoupons;
