import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrderAPI } from "../services/orderService";
import { validateCouponAPI } from "../services/couponService";
import {
  createRazorpayOrderAPI,
  verifyPaymentAPI,
  paymentFailedAPI,
} from "../services/paymentService";
import { MapPin, Phone, User, Building, Hash, Tag, X, CheckCircle } from "lucide-react";

const Checkout = () => {
  const { items, totalPrice, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preload Razorpay script on mount for faster payment
  useEffect(() => {
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const tax = Math.round(totalPrice * 0.18);
  const shippingCharge = totalPrice > 999 ? 0 : 99;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const total = totalPrice + tax + shippingCharge - discountAmount;

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError("Enter a coupon code");
      return;
    }
    setCouponError("");
    setCouponLoading(true);
    try {
      const data = await validateCouponAPI(couponInput.trim(), totalPrice);
      setAppliedCoupon(data);
      setCouponInput("");
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setCouponInput("");
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      // If script is already loaded (preloaded on mount), resolve immediately
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        // Script tag exists but may still be loading
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        // If already loaded
        if (window.Razorpay) resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { fullName, phone, address, city, state, pincode } = form;
    if (!fullName || !phone || !address || !city || !state || !pincode) {
      setError("All fields are required");
      return;
    }
    if (phone.length !== 10) {
      setError("Enter valid 10 digit phone number");
      return;
    }
    if (pincode.length !== 6) {
      setError("Enter valid 6 digit pincode");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create order with coupon info
      const order = await createOrderAPI(
        form,
        appliedCoupon?.code || null,
        discountAmount
      );

      // Step 2: Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Razorpay failed to load. Check internet connection.");
        setLoading(false);
        return;
      }

      // Step 3: Create Razorpay order
      const razorpayData = await createRazorpayOrderAPI(order._id);

      // Step 4: Open Razorpay checkout
      const options = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "LUXORA Store",
        description: `Order ${order.orderId}`,
        order_id: razorpayData.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: form.phone,
        },
        theme: { color: "#ff0076" },
        handler: function (response) {
          try {
            // Pass the verification data to the OrderSuccess page
            // so it can handle the verification and loading state there.
            const verifyData = {
              orderId: order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            
            navigate(`/order-success/${order._id}`, { 
              replace: true,
              state: { verifyData }
            });
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Payment verification failed. Contact support.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            paymentFailedAPI(order._id).catch(() => {});
            setError("Payment cancelled. Try again.");
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        paymentFailedAPI(order._id).catch(() => {});
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
      // Don't setLoading(false) here — Razorpay modal is now open
      // Loading will be reset in handler/ondismiss/payment.failed callbacks
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Almost There
          </p>
          <h1 className="font-display text-4xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
              <h2 className="font-display text-xl font-bold mb-6">
                Shipping Address
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      maxLength={10}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-4 text-zinc-400" />
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full Address (House No, Street, Area)"
                    rows={3}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      maxLength={6}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 mt-4">
              <h2 className="font-display text-xl font-bold mb-4">
                Order Items ({items.length})
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product} className="flex gap-3 items-center">
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
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 sticky top-28">
              <h2 className="font-display text-xl font-bold mb-6">
                Price Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <div>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500">
                          You save ₹{appliedCoupon.discountAmount}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          placeholder="Coupon code"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-xs mt-1.5">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">GST (18%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span className={shippingCharge === 0 ? "text-green-500 font-medium" : ""}>
                    {shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">Discount</span>
                    <span className="text-green-500 font-medium">
                      - ₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="gradient-text">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full btn-primary flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay Now ₹${total.toLocaleString("en-IN")}`
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <span>🔒 Secured by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;