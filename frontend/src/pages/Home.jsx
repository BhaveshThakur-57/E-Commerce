import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Flame, Star, Truck, Shield, Zap, Gem, Sparkles, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductsAPI } from "../services/productService";
import Loader from "../components/Loader";

const CATEGORIES = [
  { name: "T-Shirts", emoji: "👕", count: 48 },
  { name: "Shirts", emoji: "👔", count: 32 },
  { name: "Oversized", emoji: "⬛", count: 24 },
  { name: "Jackets", emoji: "🧥", count: 56 },
  { name: "Bottomwear", emoji: "👖", count: 80 },
];

const testimonials = [
  { name: "Arjun M.", text: "The quality is insane for the price. My oversized tee from LUXORA gets compliments every single time. Will definitely order again.", rating: 5, location: "Mumbai" },
  { name: "Priya S.", text: "Finally a brand that understands streetwear without being overpriced. The fit is perfect and the fabric feels premium.", rating: 5, location: "Delhi" },
  { name: "Rahul K.", text: "Ordered during the summer drop and the delivery was super fast. The packaging was amazing — felt like unboxing a luxury product.", rating: 5, location: "Bangalore" },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsAPI();
        setProducts(data.slice(0, 8));
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
            <h2 className="font-display text-4xl font-bold">Trending Streetwear</h2>
          </div>
          <Link
            to="/shop?collection=Streetwear"
            className="text-sm font-semibold text-brand-500 flex items-center gap-1 hover:gap-2 transition-all"
          >
            Shop Collection <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading products..." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Editorial / Brand Philosophy Section (replaces sale banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 p-10 sm:p-16">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-400/15 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-white/10 backdrop-blur-sm">
                <Gem size={14} /> THE LUXORA PHILOSOPHY
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Fashion Should Be{" "}
                <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Fearless</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                We don't follow trends — we set them. Every LUXORA piece is crafted with meticulous attention to detail,
                premium fabrics, and a commitment to making you feel extraordinary every time you step out.
              </p>
              <div className="flex flex-wrap gap-8 mb-8">
                {[
                  { value: "50K+", label: "Happy Customers" },
                  { value: "200+", label: "Premium Pieces" },
                  { value: "4.9★", label: "Average Rating" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-display font-bold text-white">{value}</p>
                    <p className="text-xs text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-white border border-white/20 px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-zinc-900 transition-all duration-300 text-sm"
              >
                Our Story <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Sparkles, title: "Limited Drops", desc: "Exclusive pieces in limited quantities" },
                { icon: Shield, title: "Premium Quality", desc: "Handpicked fabrics, precision craft" },
                { icon: Zap, title: "AI Powered", desc: "Smart search & recommendations" },
                { icon: Star, title: "Loved by All", desc: "4.9/5 from 50K+ reviews" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                  <Icon size={20} className="text-brand-400 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <p className="font-semibold text-white text-sm mb-1">{title}</p>
                  <p className="text-xs text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* More Products */}
      {!loading && products.length > 4 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2 flex items-center gap-1">
                <Sparkles size={14} /> Beat the heat
              </p>
              <h2 className="font-display text-4xl font-bold">Summer Wear Picks</h2>
            </div>
            <Link
              to="/shop?collection=Summer Wear"
              className="text-sm font-semibold text-brand-500 flex items-center gap-1 hover:gap-2 transition-all"
            >
              Shop Collection <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(4, 8).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2 flex items-center gap-1 justify-center">
            <Star size={14} /> Customer Love
          </p>
          <h2 className="font-display text-4xl font-bold">What People Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10"
            >
              <Quote size={24} className="text-brand-500/20 mb-3" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                "{t.text}"
              </p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-zinc-400">{t.location}</p>
            </div>
          ))}
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
              className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-brand-400/30 transition-all duration-300"
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