import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { getProductsAPI } from "../services/productService";
import { smartSearchAPI } from "../services/aiService";

const CATEGORIES = ["All", "Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [aiSearching, setAiSearching] = useState(false);

  useEffect(() => { fetchProducts(); }, [activeCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== "All") params.category = activeCategory;
      if (sortBy !== "featured") params.sort = sortBy;
      const data = await getProductsAPI(params);
      setProducts(data);
    } catch { setError("Failed to load products"); }
    finally { setLoading(false); }
  };

  const handleAISearch = async (query) => {
    if (!query || query.trim().length < 2) return;
    try {
      setAiSearching(true);
      const results = await smartSearchAPI(query.trim());
      setAiSearchResults(results);
    } catch { setAiSearchResults([]); }
    finally { setAiSearching(false); }
  };

  const toggleSize = (size) => setSelectedSizes((prev) =>
    prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
  );

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setSortBy("featured");
    setPriceRange([0, 6000]);
    setSelectedSizes([]);
    setAiSearchResults(null);
  };

  const activeFilterCount = [
    activeCategory !== "All",
    priceRange[0] > 0 || priceRange[1] < 6000,
    selectedSizes.length > 0,
  ].filter(Boolean).length;

  const filtered = products.filter((p) => {
    const matchSearch = search.length === 0 || p.name.toLowerCase().includes(search.toLowerCase());
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchSize = selectedSizes.length === 0 || (p.variants && p.variants.some((v) =>
      v.sizes.some((s) => selectedSizes.includes(s.size) && s.stock > 0)
    ));
    return matchSearch && matchPrice && matchSize;
  });

  const displayProducts = aiSearchResults !== null ? aiSearchResults : filtered;

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">Our Store</p>
            <h1 className="font-display text-5xl font-bold">Shop All</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              {aiSearching ? "Searching..." : `${displayProducts.length} products found`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? "bg-brand-500 text-white border-brand-500"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-brand-400"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-white text-brand-500 rounded-full text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-brand-400 cursor-pointer">
              {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {/* AI Search Bar — Enter pe search, no button */}
        <div className="relative mb-6 max-w-lg">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          {aiSearching && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}
          <input
            type="text"
            placeholder="Search — try 'black hoodie under 2000' and press Enter..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value === "") setAiSearchResults(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAISearch(search);
            }}
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setAiSearchResults(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={15} className="text-zinc-400 hover:text-zinc-600" />
            </button>
          )}
        </div>

        {/* AI Result Badge */}
        {aiSearchResults !== null && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-brand-500/10 text-brand-500 px-3 py-1.5 rounded-full font-medium">
              ✨ AI Results: {aiSearchResults.length} found for "{search}"
            </span>
            <button
              onClick={() => { setAiSearchResults(null); setSearch(""); }}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              Clear
            </button>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 mb-8 animate-fade-up">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="font-semibold text-sm mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeCategory === cat ? "bg-brand-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-brand-500"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button key={size} onClick={() => toggleSize(size)}
                      className={`w-10 h-10 rounded-lg text-xs font-semibold transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-brand-500 border border-zinc-200 dark:border-zinc-700"
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm mb-3">
                  Price: <span className="text-brand-500">₹{priceRange[0].toLocaleString("en-IN")} — ₹{priceRange[1].toLocaleString("en-IN")}</span>
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Min</p>
                    <input type="range" min={0} max={6000} step={100} value={priceRange[0]}
                      onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 100), priceRange[1]])}
                      className="w-full accent-brand-500" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Max</p>
                    <input type="range" min={0} max={6000} step={100} value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 100)])}
                      className="w-full accent-brand-500" />
                  </div>
                </div>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button onClick={clearFilters} className="text-sm text-red-400 hover:text-red-500 font-medium flex items-center gap-1">
                  <X size={14} /> Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {/* Category Pills */}
        {!showFilters && (
          <div className="flex gap-2 flex-wrap mb-8">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-brand-500"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Active Filter Tags */}
        {(selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 6000) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSizes.map((size) => (
              <span key={size} className="flex items-center gap-1.5 bg-brand-500/10 text-brand-500 text-xs px-3 py-1.5 rounded-full font-medium">
                Size: {size} <button onClick={() => toggleSize(size)}><X size={12} /></button>
              </span>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 6000) && (
              <span className="flex items-center gap-1.5 bg-brand-500/10 text-brand-500 text-xs px-3 py-1.5 rounded-full font-medium">
                ₹{priceRange[0]} — ₹{priceRange[1]} <button onClick={() => setPriceRange([0, 6000])}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {loading && <Loader text="Loading products..." />}
        {error && <div className="text-center py-20 text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            {displayProducts.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-display text-xl font-bold mb-2">No products found</p>
                <p className="text-zinc-400 text-sm mb-4">Try different search or filters</p>
                <button onClick={clearFilters} className="btn-primary text-sm">Clear Filters</button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;