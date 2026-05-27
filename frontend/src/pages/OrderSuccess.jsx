import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle, Package, MapPin, ArrowRight,
  Clock, Truck, Star, ShoppingBag,
} from "lucide-react";
import { getOrderByIdAPI } from "../services/orderService";
import { verifyPaymentAPI } from "../services/paymentService";
import { downloadInvoiceAPI } from "../services/invoiceService";
import Loader from "../components/Loader";
import { cancelOrderAPI } from "../services/orderService";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const TRACKING_STEPS = [
  {
    key: "processing",
    label: "Order Placed",
    icon: ShoppingBag,
    desc: "Your order has been confirmed",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
    desc: "Your order is on the way",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: Star,
    desc: "Order delivered successfully",
  },
];

const STATUS_ORDER = ["processing", "shipped", "delivered"];

const OrderTimeline = ({ order }) => {
  const currentIndex = STATUS_ORDER.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
        <p className="text-red-600 dark:text-red-400 font-semibold text-center">
          ❌ This order has been cancelled
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
      <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
        <Truck size={18} className="text-brand-500" />
        Order Tracking
      </h2>

      <div className="relative">
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-zinc-200 dark:bg-zinc-700 z-0" />
        <div
          className="absolute top-5 left-5 h-0.5 bg-brand-500 z-0 transition-all duration-700"
          style={{
            width: currentIndex === 0 ? "0%" : currentIndex === 1 ? "50%" : "100%",
          }}
        />

        <div className="relative z-10 flex justify-between">
          {TRACKING_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i <= currentIndex;
            const isCurrent = i === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isDone
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
                  } ${isCurrent ? "ring-4 ring-brand-500/20 scale-110" : ""}`}
                >
                  <Icon size={18} />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${isDone ? "text-brand-500" : "text-zinc-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-zinc-400 hidden sm:block mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {order.trackingHistory && order.trackingHistory.length > 0 && (
        <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
            Activity Log
          </p>
          <div className="space-y-4">
            {[...order.trackingHistory].reverse().map((entry, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${
                      i === 0 ? "bg-brand-500" : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                  {i < order.trackingHistory.length - 1 && (
                    <div className="w-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700 mt-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p
                    className={`text-sm font-medium capitalize ${
                      i === 0 ? "text-brand-500" : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {entry.status}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{entry.message}</p>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(entry.timestamp).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const { fetchCart } = useCart();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(!!location.state?.verifyData);
  const [downloading, setDownloading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const processOrder = async () => {
      try {
        if (location.state?.verifyData) {
          setVerifying(true);
          await verifyPaymentAPI(location.state.verifyData);
          // Clear the state so it doesn't re-verify on refresh
          window.history.replaceState({}, document.title);
          fetchCart().catch(() => {});
        }
        const data = await getOrderByIdAPI(id);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch/verify order");
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    };
    processOrder();
  }, [id, location.state?.verifyData, fetchCart]);

  if (verifying) return <div className="pt-28"><Loader text="Verifying your payment... Please do not close this window." /></div>;
  if (loading) return <div className="pt-28"><Loader /></div>;

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-zinc-500">
            Thank you for shopping with LUXORA! Your order is confirmed.
          </p>
          {order && (
            <p className="text-brand-500 font-semibold mt-2">
              Order ID: {order.orderId}
            </p>
          )}
        </div>

        {order && (
          <div className="space-y-4">

            {/* Tracking Timeline */}
            <OrderTimeline order={order} />

            {/* Order Items */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Package size={18} className="text-brand-500" />
                Order Items
              </h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${item.product}/60/70`;
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-zinc-400 text-xs">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-sm">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>GST (18%)</span>
                  <span>₹{order.tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Shipping</span>
                  <span className={order.shippingCharge === 0 ? "text-green-500" : ""}>
                    {order.shippingCharge === 0 ? "Free" : `₹${order.shippingCharge}`}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">
                      Discount {order.couponCode && `(${order.couponCode})`}
                    </span>
                    <span className="text-green-500 font-medium">
                      - ₹{order.discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-1">
                  <span>Total</span>
                  <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-brand-500" />
                Shipping Address
              </h2>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} —{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </div>

            {/* Status + Cancel */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Order Status</p>
                  <span
                    className={`inline-block text-sm px-3 py-1 rounded-full font-medium capitalize ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-600"
                        : order.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-600"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Payment</p>
                  <span
                    className={`inline-block text-sm px-3 py-1 rounded-full font-medium capitalize ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Cancel Button */}
              {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  {cancelError && (
                    <p className="text-red-500 text-sm mb-3">{cancelError}</p>
                  )}
                  <button
                    onClick={async () => {
                      if (!window.confirm("Are you sure you want to cancel this order?")) return;
                      try {
                        setCancelling(true);
                        const updated = await cancelOrderAPI(order._id);
                        setOrder(updated);
                      } catch (err) {
                        setCancelError(err?.response?.data?.message || "Failed to cancel order");
                      } finally {
                        setCancelling(false);
                      }
                    }}
                    disabled={cancelling}
                    className="w-full py-3 rounded-xl border-2 border-red-400 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>

            {/* Download Invoice */}
            {order?.paymentStatus === "paid" && (
              <button
                onClick={async () => {
                  setDownloading(true);
                  await downloadInvoiceAPI(order._id);
                  setDownloading(false);
                }}
                disabled={downloading}
                className={`w-full btn-primary flex items-center justify-center gap-2 mt-6 ${
                  downloading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {downloading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  "📄 Download Invoice"
                )}
              </button>
            )}

            <div className="flex gap-4 mt-4">
              <Link to="/shop" className="flex-1 btn-outline text-center">
                Continue Shopping
              </Link>
              <Link
                to="/orders"
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                My Orders <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        )}
      </div>
    </main>
  );
};

export default OrderSuccess;
