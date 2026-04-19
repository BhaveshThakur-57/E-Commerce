import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { getProductsAPI } from "../services/productService";

const CATEGORIES = [
  "All",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Footwear",
  "Accessories",
];

const Shop = () => {
  const [products, setProducts] = useState([]);      // ✅ real data
  const [loading, setLoading] = useState(true);      // ✅ added
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(6000);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsAPI();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  let filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.price <= priceRange);

  if (sortBy === "price-asc")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating")
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="mb-10">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Our Store
          </p>
          <h1 className="font-display text-5xl font-bold mb-4">Shop All</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {filtered.length} products found
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeCategory === cat
                    ? "bg-brand-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <SlidersHorizontal size={16} />
          <span className="text-sm">Max Price:</span>
          <input
            type="range"
            min={500}
            max={6000}
            step={100}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
          />
          <span>₹{priceRange}</span>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;