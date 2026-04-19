import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const { items, isOpen, toggleCart, removeItem, updateQty, totalItems, totalPrice, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    if (!user) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
          onClick={toggleCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-zinc-900 z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500/10 rounded-lg flex items-center justify-center">
              <ShoppingBag size={16} className="text-brand-500" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Your Cart</h2>
              <p className="text-xs text-zinc-400">{totalItems} items</p>
            </div>
          </div>
          <button
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-400">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="opacity-40" />
              </div>
              <p className="font-medium">Your cart is empty</p>
              <button onClick={toggleCart} className="btn-primary text-sm">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product}
                className="flex gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${item.product}/80/100`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1 mb-1">{item.name}</h4>
                  <p className="text-brand-500 font-bold text-sm mb-3">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.product, item.qty - 1)}
                      className="w-7 h-7 rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center hover:border-brand-400 hover:text-brand-500 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product, item.qty + 1)}
                      disabled={item.qty >= item.stock}
                      className="w-7 h-7 rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center hover:border-brand-400 hover:text-brand-500 transition-colors disabled:opacity-40"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-fit text-zinc-400 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Subtotal</span>
              <span className="font-bold text-lg">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-zinc-400">
              <span>Shipping</span>
              <span className="text-green-500 font-medium">Free</span>
            </div>
            <button
              onClick={handleCheckout}
              className="flex items-center justify-center gap-2 w-full btn-primary"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <button
              onClick={toggleCart}
              className="w-full text-center text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;