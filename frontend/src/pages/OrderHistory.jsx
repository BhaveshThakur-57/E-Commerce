import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { getMyOrdersAPI } from "../services/orderService";
import Loader from "../components/Loader";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrdersAPI();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-600";
      case "shipped": return "bg-blue-100 text-blue-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-orange-100 text-orange-600";
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Your History
          </p>
          <h1 className="font-display text-4xl font-bold">My Orders</h1>
        </div>

        {loading ? (
          <Loader text="Loading orders..." />
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-zinc-400" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-zinc-500 mb-6">Start shopping to see your orders here.</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-brand-500 text-sm">
                      {order.orderId}
                    </p>
                    <p className="text-zinc-400 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${item.product}/60/70`;
                      }}
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-14 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-semibold text-zinc-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="font-bold">
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </p>
                  <Link
                    to={`/order-success/${order._id}`}
                    className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderHistory;