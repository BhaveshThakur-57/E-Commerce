import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Star, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
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
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-zinc-50 dark:bg-zinc-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${product._id}/400/500`;
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          {product.stock < 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-zinc-800 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist + View Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
              liked
                ? "bg-brand-500 text-white"
                : "bg-white dark:bg-zinc-800 text-zinc-600 hover:text-brand-500"
            }`}
          >
            <Heart size={15} fill={liked ? "white" : "none"} />
          </button>
          <Link
            to={`/product/${product._id}`}
            className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 text-zinc-600 flex items-center justify-center shadow-lg hover:text-brand-500 transition-colors"
          >
            <Eye size={15} />
          </Link>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-full py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              added
                ? "bg-green-500 text-white"
                : product.stock === 0
                ? "bg-zinc-400 text-white cursor-not-allowed"
                : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-brand-500 hover:text-white shadow-lg"
            }`}
          >
            <ShoppingBag size={14} />
            {added ? "Added!" : product.stock === 0 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Info */}
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
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-zinc-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;