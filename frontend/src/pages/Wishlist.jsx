import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = async (product) => {
    await addItem(product, 1);
    await removeFromWishlist(product._id);
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Your Saved Items
          </p>
          <h1 className="font-display text-4xl font-bold">Wishlist</h1>
        </div>

        {loading ? (
          <Loader text="Loading wishlist..." />
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-zinc-400" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-zinc-500 mb-6">
              Save items you love to buy them later.
            </p>
            <Link to="/shop" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden group"
              >
                {/* Image */}
                <Link to={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/${product._id}/300/400`;
                    }}
                  />
                </Link>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-brand-500 font-semibold uppercase tracking-wide mb-1">
                    {product.category}
                  </p>
                  <Link
                    to={`/product/${product._id}`}
                    className="font-display font-bold text-base hover:text-brand-500 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="font-bold text-lg mt-1">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                    >
                      <ShoppingBag size={15} />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
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

export default Wishlist;