import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, MapPin, ArrowRight } from "lucide-react";
import { getOrderByIdAPI } from "../services/orderService";
import Loader from "../components/Loader";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderByIdAPI(id);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

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
            Order Placed!
          </h1>
          <p className="text-zinc-500">
            Thank you! Your order has been placed successfully.
          </p>
          {order && (
            <p className="text-brand-500 font-semibold mt-2">
              Order ID: {order.orderId}
            </p>
          )}
        </div>

        {order && (
          <div className="space-y-4">
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

            {/* Status */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Order Status</p>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm px-3 py-1 rounded-full font-medium capitalize">
                    {order.orderStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Payment</p>
                  <span className={`inline-block text-sm px-3 py-1 rounded-full font-medium capitalize ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
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
    </main>
  );
};

export default OrderSuccess;