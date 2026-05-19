import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Truck, ShoppingBag, Star } from "lucide-react";
import { getMyOrdersAPI } from "../services/orderService";
import { downloadInvoiceAPI } from "../services/invoiceService";
import Loader from "../components/Loader";
import { cancelOrderAPI } from "../services/orderService";

const TRACKING_STEPS = ["processing", "shipped", "delivered"];

const TrackingMini = ({ orderStatus }) => {
  const currentIndex = TRACKING_STEPS.indexOf(orderStatus);
  const isCancelled = orderStatus === "cancelled";

  if (isCancelled) {
    return (
      <span className="text-xs text-red-500 font-medium">❌ Cancelled</span>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-2">
      {TRACKING_STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              i <= currentIndex ? "bg-brand-500" : "bg-zinc-300 dark:bg-zinc-600"
            }`}
          />
          {i < TRACKING_STEPS.length - 1 && (
            <div
              className={`h-0.5 w-6 transition-all ${
                i < currentIndex ? "bg-brand-500" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          )}
        </div>
      ))}
      <span className="text-xs text-zinc-500 ml-1 capitalize">{orderStatus}</span>
    </div>
  );
};

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
                    <TrackingMini orderStatus={order.orderStatus} />
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
                  <div>
                    <p className="font-bold">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </p>
                    {order.discountAmount > 0 && (
                      <p className="text-xs text-green-500 mt-0.5">
                        Saved ₹{order.discountAmount} {order.couponCode && `(${order.couponCode})`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {order.paymentStatus === "paid" && (
                      <button
                        onClick={() => downloadInvoiceAPI(order._id)}
                        className="text-sm text-zinc-500 hover:text-brand-500 transition-colors flex items-center gap-1"
                      >
                        📄 Invoice
                      </button>
                    )}

                    {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
                      <button
                        onClick={async () => {
                          if (!window.confirm("Cancel this order?")) return;
                          try {
                            await cancelOrderAPI(order._id);
                            setOrders((prev) =>
                              prev.map((o) =>
                                o._id === order._id ? { ...o, orderStatus: "cancelled" } : o
                              )
                            );
                          } catch (err) {
                            alert(err?.response?.data?.message || "Failed to cancel");
                          }
                        }}
                        className="text-sm text-red-400 hover:text-red-500 font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}

                    <Link
                      to={`/order-success/${order._id}`}
                      className="text-sm text-brand-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
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