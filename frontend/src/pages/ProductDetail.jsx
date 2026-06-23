import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star, ArrowLeft, Truck, Shield, ChevronLeft, ChevronRight, Trash2, X, Ruler } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductByIdAPI } from "../services/productService";
import Loader from "../components/Loader";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import { getProductReviewsAPI, addReviewAPI, deleteReviewAPI } from "../services/reviewService";
import { getRecommendationsAPI, predictSizeAPI } from "../services/aiService";

const getAllImages = (product) => {
  const imgs = [];
  if (product.image) imgs.push({ url: product.image, alt: product.name });
  if (product.images && product.images.length > 0) product.images.forEach((img) => imgs.push(img));
  return imgs;
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: "", comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);

  // Size Predictor State
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [sizeForm, setSizeForm] = useState({ height: "", weight: "", fitPreference: "Regular" });
  const [sizeResult, setSizeResult] = useState(null);
  const [sizePredicting, setSizePredicting] = useState(false);
  const [sizeError, setSizeError] = useState("");

  const fetchReviews = async (productId) => {
    try {
      setReviewsLoading(true);
      const data = await getProductReviewsAPI(productId);
      setReviews(data);
    } catch { console.error("Failed to fetch reviews"); }
    finally { setReviewsLoading(false); }
  };

  // Start fetching recommendations immediately using URL param id
  useEffect(() => {
    setRecsLoading(true);
    setRecommendations([]);
    getRecommendationsAPI(id)
      .then((recs) => setRecommendations(recs))
      .catch(() => console.error("Recommendations failed"))
      .finally(() => setRecsLoading(false));
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductByIdAPI(id);
        setProduct(data);
        setActiveImg(0);
        if (data.variants && data.variants.length > 0) setSelectedColor(data.variants[0]);
        fetchReviews(data._id);
      } catch { setError("Product not found"); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [id]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const getStockForSize = (size) => {
    if (!selectedColor) return 0;
    const sizeObj = selectedColor.sizes.find((s) => s.size === size);
    return sizeObj ? sizeObj.stock : 0;
  };

  const selectedSizeStock = selectedSize ? getStockForSize(selectedSize) : 0;
  const hasVariants = product?.variants && product.variants.length > 0;
  const wishlisted = product ? isWishlisted(product._id) : false;

  const handleWishlist = async () => {
    if (!user) { navigate("/login"); return; }
    setWishlistLoading(true);
    await toggleWishlist(product._id);
    setWishlistLoading(false);
  };

  const handleAdd = async () => {
    if (!user) { navigate("/login"); return; }
    if (hasVariants) {
      if (!selectedColor) { setAddError("Please select a color"); return; }
      if (!selectedSize) { setAddError("Please select a size"); return; }
      if (selectedSizeStock === 0) { setAddError("This size is out of stock"); return; }
    }
    setAddError("");
    setAddLoading(true);
    try {
      await addItem(product, 1, selectedSize || "", selectedColor?.color || "", selectedColor?.colorCode || "");
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) { setAddError(err?.response?.data?.message || "Failed to add to cart"); }
    finally { setAddLoading(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (reviewForm.rating === 0) { setReviewError("Please select a rating"); return; }
    if (!reviewForm.title.trim()) { setReviewError("Please add a title"); return; }
    if (!reviewForm.comment.trim()) { setReviewError("Please write a review"); return; }
    try {
      setReviewSubmitting(true);
      const newReview = await addReviewAPI(product._id, reviewForm);
      setReviews((prev) => [newReview, ...prev]);
      setReviewForm({ rating: 0, title: "", comment: "" });
      setShowReviewForm(false);
      setReviewSuccess("Review submitted successfully!");
      setTimeout(() => setReviewSuccess(""), 3000);
      setProduct((prev) => ({ ...prev, numReviews: reviews.length + 1 }));
    } catch (err) { setReviewError(err?.response?.data?.message || "Failed to submit review"); }
    finally { setReviewSubmitting(false); }
  };

  const handleDeleteReview = async (reviewId) => {
    try { await deleteReviewAPI(reviewId); setReviews((prev) => prev.filter((r) => r._id !== reviewId)); }
    catch { alert("Failed to delete review"); }
  };

  const handleSizePredict = async (e) => {
    e.preventDefault();
    setSizeError("");
    setSizeResult(null);

    if (!sizeForm.height || !sizeForm.weight) {
      setSizeError("Please enter your height and weight.");
      return;
    }

    try {
      setSizePredicting(true);
      const res = await predictSizeAPI({
        height: sizeForm.height,
        weight: sizeForm.weight,
        fitPreference: sizeForm.fitPreference,
        productCategory: product.category,
      });
      setSizeResult(res);
      // Auto-select the size if it exists
      if (res.size) {
        setSelectedSize(res.size);
      }
    } catch (err) {
      setSizeError(err.response?.data?.message || "Failed to predict size.");
    } finally {
      setSizePredicting(false);
    }
  };

  if (loading) return <div className="pt-28"><Loader text="Loading product..." /></div>;
  if (error) return (
    <div className="pt-28 text-center py-20">
      <p className="text-red-500 text-lg">{error}</p>
      <Link to="/shop" className="btn-primary mt-4 inline-block">Back to Shop</Link>
    </div>
  );

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const allImages = getAllImages(product);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="flex gap-4 lg:max-w-md w-full mx-auto">
            {allImages.length > 1 && (
              <div className="flex flex-col gap-3 w-20 flex-shrink-0">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${activeImg === i ? "border-brand-500 shadow-lg shadow-brand-500/20" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}${i}/80/96`; }} />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 relative">
              <div ref={imageRef}
                className={`relative rounded-3xl overflow-hidden aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onMouseEnter={() => setIsZoomed(true)} onMouseLeave={() => setIsZoomed(false)} onMouseMove={handleMouseMove}>
                <img src={allImages[activeImg]?.url || product.image} alt={allImages[activeImg]?.alt || product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={isZoomed ? { transform: "scale(2)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : { transform: "scale(1)" }}
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/600/800`; }} />

                {!isZoomed && (
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm z-10">🔍 Hover to zoom</div>
                )}

                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg((prev) => prev === 0 ? allImages.length - 1 : prev - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 dark:bg-zinc-800/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all z-10">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setActiveImg((prev) => prev === allImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 dark:bg-zinc-800/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all z-10">
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                      {allImages.map((_, i) => (
                        <button key={i} onClick={() => setActiveImg(i)}
                          className={`rounded-full transition-all duration-200 ${activeImg === i ? "w-5 h-2 bg-brand-500" : "w-2 h-2 bg-white/60"}`} />
                      ))}
                    </div>
                  </>
                )}

                <button onClick={handleWishlist} disabled={wishlistLoading}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-10 ${wishlisted ? "bg-brand-500 text-white" : "bg-white text-zinc-600 hover:bg-brand-50"}`}>
                  <Heart size={18} fill={wishlisted ? "white" : "none"} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">
                {product.category}
                {product.collections && product.collections.length > 0 && (
                  <span className="text-zinc-400 font-normal ml-2">
                    • {product.collections.join(" • ")}
                  </span>
                )}
              </p>
              <h1 className="font-display text-4xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={Math.round(product.rating)} readonly size={16} />
                <span className="text-sm text-zinc-500">{product.rating} ({product.numReviews} reviews)</span>
              </div>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">₹{product.price.toLocaleString("en-IN")}</p>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{product.description}</p>

            {hasVariants && (
              <div>
                <p className="font-semibold text-sm mb-3">Color: <span className="text-brand-500 font-bold">{selectedColor?.color || "Select"}</span></p>
                <div className="flex gap-3 flex-wrap">
                  {product.variants.map((variant) => (
                    <button key={variant.color} onClick={() => { setSelectedColor(variant); setSelectedSize(null); setAddError(""); }} title={variant.color}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 ${selectedColor?.color === variant.color ? "border-brand-500 scale-110 shadow-lg" : "border-zinc-300 dark:border-zinc-600"}`}
                      style={{ backgroundColor: variant.colorCode }} />
                  ))}
                </div>
              </div>
            )}

            {hasVariants && selectedColor && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm">Size: <span className="text-brand-500 font-bold">{selectedSize || "Select"}</span></p>
                  <button 
                    onClick={() => { setShowSizeModal(true); setSizeResult(null); }}
                    className="text-xs bg-gradient-to-r from-brand-500 to-accent-400 text-white px-3 py-1.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    ✨ Find My Size
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {allSizes.map((size) => {
                    const stock = getStockForSize(size);
                    const isAvailable = stock > 0;
                    const isSelected = selectedSize === size;
                    return (
                      <button key={size} onClick={() => { if (isAvailable) { setSelectedSize(size); setAddError(""); } }} disabled={!isAvailable}
                        className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all duration-200 relative ${isSelected ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30" : isAvailable ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-brand-400 hover:text-brand-500 border border-zinc-200 dark:border-zinc-700" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed border border-zinc-200 dark:border-zinc-700 line-through"}`}>
                        {size}
                        {isAvailable && stock <= 3 && !isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-orange-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">{stock}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSize && selectedSizeStock > 0 && selectedSizeStock <= 5 && (
                  <p className="text-orange-500 text-xs mt-2 font-medium">Only {selectedSizeStock} left in this size!</p>
                )}
              </div>
            )}

            {!hasVariants && (
              <div>
                {product.stock === 0 ? <span className="inline-block bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium">Out of Stock</span>
                  : product.stock <= 5 ? <span className="inline-block bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full font-medium">Only {product.stock} left!</span>
                  : <span className="inline-block bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-medium">In Stock</span>}
              </div>
            )}

            {addError && <p className="text-red-500 text-sm font-medium">{addError}</p>}

            <button onClick={handleAdd} disabled={addLoading || (!hasVariants && product.stock === 0)}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all duration-300 ${added ? "bg-green-500 text-white" : addLoading ? "bg-brand-400 text-white opacity-70 cursor-not-allowed" : !hasVariants && product.stock === 0 ? "bg-zinc-300 text-zinc-500 cursor-not-allowed" : "btn-primary"}`}>
              {addLoading ? (<><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Adding...</>)
                : added ? "Added to Cart! ✓"
                : (<><ShoppingBag size={18} />{!hasVariants && product.stock === 0 ? "Out of Stock" : "Add to Cart"}</>)}
            </button>

            <div className="flex gap-6 pt-2">
              {[{ icon: Truck, text: "Free delivery over ₹999" }, { icon: Shield, text: "30-day returns" }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-zinc-500"><Icon size={15} className="text-brand-500" />{text}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">Customer Reviews</h2>
              <div className="flex items-center gap-3 mt-2">
                <StarRating rating={Math.round(product.rating)} readonly size={18} />
                <span className="text-zinc-500 text-sm">{product.rating} out of 5 ({product.numReviews} reviews)</span>
              </div>
            </div>
            {user && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} className="btn-primary text-sm !py-2.5">Write a Review</button>
            )}
          </div>

          {reviewSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-600 text-sm font-medium">✅ {reviewSuccess}</div>
          )}

          {showReviewForm && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 mb-8 animate-scale-in">
              <h3 className="font-display text-xl font-bold mb-6">Write Your Review</h3>
              {reviewError && <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-500 text-sm">{reviewError}</div>}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Your Rating</p>
                  <StarRating rating={reviewForm.rating} onRate={(r) => setReviewForm((prev) => ({ ...prev, rating: r }))} size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Review Title</p>
                  <input type="text" value={reviewForm.title} onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience" maxLength={100}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Your Review</p>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell others about your experience..." rows={4} maxLength={500}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 transition-colors resize-none" />
                  <p className="text-xs text-zinc-400 mt-1 text-right">{reviewForm.comment.length}/500</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setShowReviewForm(false); setReviewError(""); }} className="flex-1 btn-outline">Cancel</button>
                  <button onClick={handleReviewSubmit} disabled={reviewSubmitting}
                    className={`flex-1 btn-primary flex items-center justify-center gap-2 ${reviewSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}>
                    {reviewSubmitting ? (<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting...</>) : "Submit Review"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {reviewsLoading ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
              <p className="text-4xl mb-3">✍️</p>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">No reviews yet</p>
              <p className="text-zinc-400 text-sm mt-1">Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white text-sm font-bold">
                        {review.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.user?.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} readonly size={13} />
                          {review.verifiedPurchase && <span className="text-xs text-green-600 font-medium">✅ Verified Purchase</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      {user && user._id === review.user?._id && (
                        <button onClick={() => handleDeleteReview(review._id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        {(recsLoading || recommendations.length > 0) && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="font-display text-2xl font-bold">You Might Also Like</h2>
              <span className="text-xs bg-gradient-to-r from-brand-500 to-accent-400 text-white px-2.5 py-1 rounded-full font-medium">✨ AI Picks</span>
            </div>
            {recsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-zinc-200 dark:bg-zinc-800 rounded-2xl aspect-[3/4] mb-3" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-16 mb-2" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendations.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            )}
          </div>
        )}

        {/* AI Size Predictor Modal */}
        {showSizeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-sm w-full animate-scale-in shadow-2xl border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-500/20 blur-3xl rounded-full" />
              
              <button 
                onClick={() => setShowSizeModal(false)}
                className="absolute top-4 right-4 p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors z-50 cursor-pointer shadow-sm"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-400 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-500/30">
                  <Ruler size={24} />
                </div>
                <h3 className="text-xl font-display font-bold mb-1">AI Size Predictor</h3>
                <p className="text-sm text-zinc-500 mb-6">Let Gemini recommend your perfect fit.</p>

                {sizeError && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm rounded-xl">{sizeError}</div>}

                {sizeResult ? (
                  <div className="text-center py-4">
                    <div className="inline-block p-1 bg-gradient-to-r from-brand-500 to-accent-400 rounded-2xl mb-4">
                      <div className="bg-white dark:bg-zinc-900 px-6 py-4 rounded-xl flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Recommended Size</span>
                        <span className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-400">
                          {sizeResult.size}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl text-left border border-zinc-100 dark:border-zinc-700">
                      " {sizeResult.explanation} "
                    </p>
                    <button 
                      onClick={() => setShowSizeModal(false)}
                      className="mt-6 w-full btn-primary"
                    >
                      Apply & Continue
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSizePredict} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 mb-1 block">Height (cm)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 175"
                          value={sizeForm.height}
                          onChange={(e) => setSizeForm({ ...sizeForm, height: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-500 mb-1 block">Weight (kg)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 70"
                          value={sizeForm.weight}
                          onChange={(e) => setSizeForm({ ...sizeForm, weight: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 mb-1 block">Fit Preference</label>
                      <select 
                        value={sizeForm.fitPreference}
                        onChange={(e) => setSizeForm({ ...sizeForm, fitPreference: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-500"
                      >
                        <option value="Regular">Regular Fit</option>
                        <option value="Slim">Slim Fit</option>
                        <option value="Oversized">Oversized / Baggy</option>
                      </select>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={sizePredicting}
                      className="w-full mt-2 bg-gradient-to-r from-brand-500 to-accent-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
                    >
                      {sizePredicting ? (
                        <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Analyzing...</>
                      ) : "Predict Size"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default ProductDetail;