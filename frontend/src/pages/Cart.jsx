import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={40} className="text-zinc-400" />
          </div>
          <h2 className="font-display text-3xl font-bold">Cart is empty</h2>
          <p className="text-zinc-500">
            Looks like you haven't added anything yet.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  const shipping = totalPrice > 999 ? 0 : 99;
  const total = totalPrice + shipping;

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold">Your Cart</h1>
            <p className="text-zinc-500 mt-1">{items.length} items</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-500 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group animate-fade-up"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-32 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${item._id}/100/130`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-xs text-brand-500 font-semibold uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-display font-semibold text-lg leading-tight">
                        {item.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white mt-2 mb-4">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:border-brand-400 hover:text-brand-500 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:border-brand-400 hover:text-brand-500 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                    <span className="text-sm text-zinc-400 ml-2">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-brand-500 hover:gap-3 transition-all mt-4"
            >
              <ArrowLeft size={15} /> Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 sticky top-28">
              <h2 className="font-display text-xl font-bold mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span className={shipping === 0 ? "text-green-500 font-medium" : ""}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-zinc-400">
                    Add ₹{(999 - totalPrice).toLocaleString("en-IN")} more for
                    free shipping
                  </p>
                )}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button className="w-full btn-primary flex items-center justify-center gap-2">
                Checkout <ArrowRight size={16} />
              </button>
              <p className="text-center text-xs text-zinc-400 mt-4">
                Secure checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;