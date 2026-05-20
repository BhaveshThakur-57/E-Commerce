import { useState, useEffect } from "react";
import { getAllOrdersAdminAPI, updateOrderStatusAPI } from "../../services/adminService";
import Loader from "../../components/Loader";
import AdminSidebar from "../../components/AdminSidebar";

const ORDER_STATUSES = ["processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrdersAdminAPI();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await updateOrderStatusAPI(orderId, newStatus);
      setOrders(orders.map((o) =>
        o._id === orderId ? { ...o, orderStatus: newStatus } : o
      ));
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "delivered": return "text-green-600";
      case "shipped": return "text-blue-600";
      case "cancelled": return "text-red-600";
      default: return "text-orange-600";
    }
  };

  const paymentColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-600";
      case "failed": return "bg-red-100 text-red-600";
      default: return "bg-orange-100 text-orange-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-8">

        <div className="mb-10">

          <h1 className="font-display text-4xl font-bold">Orders</h1>
          <p className="text-zinc-500 mt-1">{orders.length} total orders</p>
        </div>

        {loading ? (
          <Loader text="Loading orders..." />
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Order ID</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Customer</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Items</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Total</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Payment</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <p className="text-brand-500 font-semibold text-xs">
                          {order.orderId}
                        </p>
                        <p className="text-zinc-400 text-xs mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">{order.user?.name}</p>
                        <p className="text-xs text-zinc-400">{order.user?.email}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {order.items?.slice(0, 2).map((item, i) => (
                            <img
                              key={i}
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-10 object-cover rounded"
                              onError={(e) => {
                                e.target.src = `https://picsum.photos/seed/${item.product}/30/40`;
                              }}
                            />
                          ))}
                          {order.items?.length > 2 && (
                            <div className="w-8 h-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-500">
                              +{order.items.length - 2}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-sm">
                        ₹{order.totalPrice?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${paymentColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className={`text-xs font-semibold px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:border-brand-400 cursor-pointer capitalize ${statusColor(order.orderStatus)} ${
                            updating === order._id ? "opacity-50" : ""
                          }`}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status} className="text-zinc-900 dark:text-white">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;