import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  "All",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Footwear",
  "Accessories",
];

const PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  _id: String(i + 1),
  name: [
    "Oversized Zen Hoodie",
    "Canvas Sneakers",
    "Cargo Pants",
    "Linen Blazer",
    "Knit Beanie",
    "Leather Belt",
    "Silk Scarf",
    "Denim Jacket",
    "Track Pants",
    "Chunky Boots",
    "Merino Sweater",
    "Swim Shorts",
  ][i],
  price: [
    2499, 3999, 3299, 5499, 899, 1299, 1999, 4999, 2299, 5999, 3799, 1799,
  ][i],
  category: [
    "Tops",
    "Footwear",
    "Bottoms",
    "Outerwear",
    "Accessories",
    "Accessories",
    "Accessories",
    "Outerwear",
    "Bottoms",
    "Footwear",
    "Tops",
    "Bottoms",
  ][i],
  rating: [4.8, 4.5, 4.7, 4.9, 4.3, 4.1, 4.6, 4.8, 4.4, 4.9, 4.7, 4.2][i],
  image: `https://picsum.photos/seed/shop${i + 1}/400/500`,
  stock: [8, 4, 12, 3, 20, 15, 7, 5, 11, 2, 9, 16][i],
}));

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(6000);

  let filtered = PRODUCTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  ).filter((p) => p.price <= priceRange);

  if (sortBy === "price-asc")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating")
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Our Store
          </p>
          <h1 className="font-display text-5xl font-bold mb-4">Shop All</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {filtered.length} products found
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-500"
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
              className="px-4 py-2 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-none outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8 flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 w-fit">
          <SlidersHorizontal size={16} className="text-brand-500" />
          <span className="text-sm font-medium">Max Price:</span>
          <input
            type="range"
            min={500}
            max={6000}
            step={100}
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-32 accent-brand-500"
          />
          <span className="text-sm font-bold text-brand-500">
            ₹{priceRange.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-zinc-400">
              <p className="text-5xl mb-4">🛍️</p>
              <p className="font-medium">No products found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Shop;