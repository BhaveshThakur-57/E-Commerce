import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStatsAPI } from "../../services/adminService";
import Loader from "../../components/Loader";
import {
  ShoppingBag, Users, Package, IndianRupee,
  TrendingUp, AlertTriangle, ArrowRight
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStatsAPI();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="pt-28"><Loader text="Loading dashboard..." /></div>;

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString("en-IN") || 0}`,
      icon: IndianRupee,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-brand-500/10 text-brand-500",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  const orderStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-600";
      case "shipped": return "bg-blue-100 text-blue-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-orange-100 text-orange-600";
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">
              Admin Panel
            </p>
            <h1 className="font-display text-4xl font-bold">Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/products" className="btn-outline text-sm !py-2">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="btn-primary text-sm !py-2">
              Manage Orders
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ title, value, icon: Icon, color }) => (
            <div
              key={title}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold font-display">{value}</p>
              <p className="text-sm text-zinc-500 mt-1">{title}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-sm text-brand-500 flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentOrders?.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-500">
                      {order.orderId}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {order.user?.name} • ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${orderStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-500" />
                Low Stock Alert
              </h2>
              <Link
                to="/admin/products"
                className="text-sm text-brand-500 flex items-center gap-1 hover:gap-2 transition-all"
              >
                Manage <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.lowStockProducts?.length === 0 ? (
                <p className="text-zinc-400 text-sm text-center py-4">
                  All products well stocked! ✅
                </p>
              ) : (
                stats?.lowStockProducts?.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
                  >
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-zinc-400">{product.category}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.stock === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    }`}>
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;