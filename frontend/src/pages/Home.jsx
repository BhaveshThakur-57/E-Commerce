import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Flame, Star, Truck, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductsAPI } from "../services/productService";
import Loader from "../components/Loader";

const CATEGORIES = [
  { name: "Tops", emoji: "👕", count: 48 },
  { name: "Bottoms", emoji: "👖", count: 32 },
  { name: "Outerwear", emoji: "🧥", count: 24 },
  { name: "Footwear", emoji: "👟", count: 56 },
  { name: "Accessories", emoji: "👜", count: 80 },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsAPI();
        setProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main>
      <HeroSection />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">
              Browse By
            </p>
            <h2 className="font-display text-4xl font-bold">Categories</h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-brand-500 flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="flex-shrink-0 group"
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <span className="text-4xl group-hover:animate-float">
                  {cat.emoji}
                </span>
                <div className="text-center">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {cat.name}
                  </p>
                  <p className="text-xs text-zinc-400">{cat.count} items</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2 flex items-center gap-1">
              <Flame size={14} /> Trending Now
            </p>
            <h2 className="font-display text-4xl font-bold">Featured Picks</h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-brand-500 flex items-center gap-1 hover:gap-2 transition-all"
          >
            See All <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading products..." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-accent-400 p-10 sm:p-16 text-white text-center">
          <p className="text-brand-200 font-semibold text-sm uppercase tracking-widest mb-4">
            Limited Time
          </p>
          <h2 className="font-display text-4xl sm:text-6xl font-bold mb-6">
            Up to 50% Off
          </h2>
          <p className="text-brand-100 text-lg mb-8 max-w-md mx-auto">
            End of season sale. New arrivals dropping weekly.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-3.5 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Shop Sale <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Trust Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Free Delivery", desc: "On orders over ₹999" },
            { icon: Star, title: "4.9/5 Rating", desc: "From 50K+ reviews" },
            { icon: Shield, title: "Easy Returns", desc: "30-day hassle-free" },
            { icon: Zap, title: "Flash Deals", desc: "New drops every week" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                  {title}
                </p>
                <p className="text-xs text-zinc-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;