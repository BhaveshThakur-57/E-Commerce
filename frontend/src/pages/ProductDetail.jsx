import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star, ArrowLeft, Truck, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductByIdAPI } from "../services/productService";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);   // ✅ added
  const [loading, setLoading] = useState(true);   // ✅ added

  const [selectedSize, setSelectedSize] = useState("M");
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  // ✅ FETCH REAL PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByIdAPI(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setAdded(true);
      await addItem(product);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart");
      setAdded(false);
    }
  };

  // ✅ loading states
  if (loading) return <div className="pt-28 text-center">Loading...</div>;
  if (!product) return <div className="pt-28 text-center">Product not found</div>;

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-zinc-100 dark:bg-zinc-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${product._id}/600/800`;
              }}
            />
            <button
              onClick={() => setLiked(!liked)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                liked ? "bg-brand-500 text-white" : "bg-white text-zinc-600"
              }`}
            >
              <Heart size={18} fill={liked ? "white" : "none"} />
            </button>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <h1 className="font-display text-4xl font-bold mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-zinc-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-zinc-500">
                  {product.rating} rating
                </span>
              </div>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>

            <div>
              <p className="font-semibold text-sm mb-3">
                Select Size:{" "}
                <span className="text-brand-500">{selectedSize}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-brand-400 hover:text-brand-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  added
                    ? "bg-green-500 text-white"
                    : product.stock === 0
                    ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                <ShoppingBag size={18} />
                {added
                  ? "Added to Cart!"
                  : product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>
            </div>

            <div className="flex gap-6 pt-2">
              {[{ icon: Truck, text: "Free delivery over ₹999" },
                { icon: Shield, text: "30-day returns" }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Icon size={15} className="text-brand-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;