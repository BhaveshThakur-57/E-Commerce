import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStatsAPI } from "../../services/adminService";
import Loader from "../../components/Loader";
import AdminSidebar from "../../components/AdminSidebar";
import {
  ShoppingBag, Users, Package, IndianRupee,
  TrendingUp, AlertTriangle, ArrowRight, Activity,
  Clock, CheckCircle, XCircle, Truck, PieChart as PieIcon, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

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
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      change: "+12.5%",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      change: "+8.2%",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "from-brand-500 to-accent-400",
      bgColor: "bg-brand-500/10",
      change: "+3",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      change: "+24",
    },
  ];

  const orderStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 dark:bg-green-900/30 text-green-600";
      case "shipped": return "bg-blue-100 dark:bg-blue-900/30 text-blue-600";
      case "cancelled": return "bg-red-100 dark:bg-red-900/30 text-red-600";
      default: return "bg-orange-100 dark:bg-orange-900/30 text-orange-600";
    }
  };

  const quickActions = [
    { label: "Add Product", to: "/admin/products", icon: Package, color: "text-brand-500 bg-brand-500/10" },
    { label: "View Orders", to: "/admin/orders", icon: ShoppingBag, color: "text-blue-500 bg-blue-500/10" },
  ];

  const totalOrders = stats?.totalOrders || 1;
  const deliveredCount = stats?.recentOrders?.filter(o => o.orderStatus === "delivered").length || 0;
  const shippedCount = stats?.recentOrders?.filter(o => o.orderStatus === "shipped").length || 0;
  const processingCount = stats?.recentOrders?.filter(o => o.orderStatus === "processing").length || 0;
  const cancelledCount = stats?.recentOrders?.filter(o => o.orderStatus === "cancelled").length || 0;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-3xl sm:text-4xl font-bold">Dashboard</h1>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-500">Live</span>
            </div>
            <p className="text-zinc-500 text-sm">LUXORA Store Overview — Welcome back, Admin</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/admin/products" className="btn-outline text-sm !py-2">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="btn-primary text-sm !py-2">
              Manage Orders
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ title, value, icon: Icon, color, bgColor, change }) => (
            <div
              key={title}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-medium text-green-500 flex items-center gap-0.5">
                  <TrendingUp size={12} /> {change}
                </span>
              </div>
              <p className="text-2xl font-bold font-display">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{title}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {quickActions.map(({ label, to, icon: Icon, color }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 transition-all duration-300 group"
            >
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={16} />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <Activity size={20} className="text-brand-500" /> Revenue Analytics
              </h2>
            </div>
            <div className="h-[300px] w-full">
              {stats?.revenueData && stats.revenueData.length > 0 ? (
                <ResponsiveContainer width="99%" height="100%">
                  <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(value) => `₹${value/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#8b5cf6', fontWeight: 600 }}
                      formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400">No revenue data available</div>
              )}
            </div>
          </div>

          {/* Top Products Pie/Bar */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <BarChart3 size={20} className="text-accent-500" /> Top Selling Products
              </h2>
            </div>
            <div className="h-[300px] w-full">
              {stats?.topProductsData && stats.topProductsData.length > 0 ? (
                <ResponsiveContainer width="99%" height="100%">
                  <BarChart data={stats.topProductsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e4e4e7" opacity={0.5} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#3f3f46' }} width={120} />
                    <RechartsTooltip 
                      cursor={{fill: '#f4f4f5'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="sold" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20}>
                      {stats.topProductsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6', '#f59e0b'][index % 5]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400">No sales data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold">Recent Orders</h2>
                <p className="text-xs text-zinc-400 mt-0.5">{stats?.totalOrders || 0} total orders</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-sm text-brand-500 flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentOrders?.length === 0 ? (
                <p className="text-zinc-400 text-sm text-center py-8">No orders yet</p>
              ) : (
                stats?.recentOrders?.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                        {order.user?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-500">
                          {order.orderId}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {order.user?.name} • ₹{order.totalPrice?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${orderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <h2 className="font-display text-xl font-bold mb-6">Order Status</h2>
            <div className="space-y-4">
              {[
                { label: "Delivered", count: deliveredCount, icon: CheckCircle, color: "text-green-500 bg-green-500" },
                { label: "Shipped", count: shippedCount, icon: Truck, color: "text-blue-500 bg-blue-500" },
                { label: "Processing", count: processingCount, icon: Clock, color: "text-orange-500 bg-orange-500" },
                { label: "Cancelled", count: cancelledCount, icon: XCircle, color: "text-red-500 bg-red-500" },
              ].map(({ label, count, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={16} className={color.split(" ")[0]} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-xs text-zinc-400">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color.split(" ")[1]} transition-all duration-700`}
                        style={{ width: `${stats?.recentOrders?.length ? (count / stats.recentOrders.length * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity Feed */}
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Activity size={14} className="text-brand-500" /> Recent Activity
              </h3>
              <div className="space-y-3">
                {stats?.recentOrders?.slice(0, 3).map((order, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-zinc-500">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{order.user?.name}</span>{" "}
                      placed order <span className="text-brand-500">{order.orderId}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
          {stats?.lowStockProducts?.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">All products well stocked!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats?.lowStockProducts?.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                >
                  <div>
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-zinc-400">{product.category}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    product.stock === 0
                      ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                  }`}>
                    {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;