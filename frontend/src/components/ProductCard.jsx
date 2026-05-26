import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const wishlisted = isWishlisted(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setWishlistLoading(true);
    await toggleWishlist(product._id);
    setWishlistLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }

    // Variants wale products ke liye detail page pe bhejo
    if (hasVariants) {
      navigate(`/product/${product._id}`);
      return;
    }

    try {
      setLoading(true);
      await addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden card-hover border border-zinc-100 dark:border-zinc-800 animate-fade-up"
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: "both",
        opacity: 0,
      }}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-zinc-50 dark:bg-zinc-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" fill="%23f4f4f5"><rect width="400" height="500"/><text x="200" y="240" text-anchor="middle" font-family="system-ui" font-size="16" fill="%23a1a1aa">LUXORA</text><text x="200" y="270" text-anchor="middle" font-family="system-ui" font-size="12" fill="%23d4d4d8">Image unavailable</text></svg>`)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Stock Badge */}
        <div className="absolute top-3 left-3 z-10">
          {product.stock === 0 && !hasVariants && (
            <span className="bg-zinc-800 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              Sold Out
            </span>
          )}
          {product.stock > 0 && product.stock < 5 && !hasVariants && (
            <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              Only {product.stock} left
            </span>
          )}
          {hasVariants && (
            <span className="bg-brand-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              Multiple Colors
            </span>
          )}
        </div>

        {/* Action Buttons - fixed clipping */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
          {/* Wishlist Heart — real toggle */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${
              wishlisted
                ? "bg-brand-500 text-white"
                : "bg-white dark:bg-zinc-800 text-zinc-600 hover:text-brand-500"
            }`}
          >
            <Heart size={15} fill={wishlisted ? "white" : "none"} />
          </button>

          {/* Quick View */}
          <Link
            to={`/product/${product._id}`}
            className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 text-zinc-600 flex items-center justify-center shadow-lg hover:text-brand-500 transition-colors"
          >
            <Eye size={15} />
          </Link>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={handleAdd}
            disabled={(!hasVariants && product.stock === 0) || loading}
            className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              added
                ? "bg-green-500 text-white"
                : !hasVariants && product.stock === 0
                ? "bg-zinc-400 text-white cursor-not-allowed"
                : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-brand-500 hover:text-white shadow-lg"
            }`}
          >
            <ShoppingBag size={14} />
            {loading
              ? "Adding..."
              : added
              ? "Added!"
              : hasVariants
              ? "Select Options"
              : product.stock === 0
              ? "Sold Out"
              : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <Link to={`/product/${product._id}`} className="block p-4">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs text-brand-500 font-semibold uppercase tracking-widest">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {product.rating}
            </span>
          </div>
        </div>
        <h3 className="font-display font-semibold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight line-clamp-1 group-hover:text-brand-500 transition-colors">
          {product.name}
        </h3>

        {/* Color dots preview */}
        {hasVariants && (
          <div className="flex gap-1.5 mb-2">
            {product.variants.slice(0, 4).map((v) => (
              <div
                key={v.color}
                className="w-3.5 h-3.5 rounded-full border border-zinc-200"
                style={{ backgroundColor: v.colorCode }}
                title={v.color}
              />
            ))}
            {product.variants.length > 4 && (
              <span className="text-xs text-zinc-400">+{product.variants.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;