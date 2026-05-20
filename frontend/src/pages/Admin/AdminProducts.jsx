import { useState, useEffect } from "react";
import { getProductsAPI } from "../../services/productService";
import { createProductAdminAPI, updateProductAdminAPI, deleteProductAdminAPI, uploadImageAPI } from "../../services/adminService";
import { generateDescriptionAPI } from "../../services/aiService";
import Loader from "../../components/Loader";
import AdminSidebar from "../../components/AdminSidebar";
import { Plus, Edit2, Trash2, X, Save, Upload } from "lucide-react";

const CATEGORIES = ["Streetwear", "Essentials", "Oversized Fits", "Urban Classics", "Summer Drop", "Winter Layers", "Premium Cotton", "Limited Edition"];
const emptyForm = { name: "", description: "", price: "", image: "", images: [], category: "Streetwear", stock: "", variants: [] };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newVariant, setNewVariant] = useState({ color: "", colorCode: "", sizes: {} });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsAPI();
      setProducts(data);
    } catch { console.error("Failed to fetch products"); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({ 
      name: product.name, 
      description: product.description, 
      price: product.price, 
      image: product.image, 
      images: product.images || [], 
      category: product.category, 
      stock: product.stock,
      variants: product.variants || []
    });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditProduct(null);
    setForm(emptyForm);
    setError("");
    setNewVariant({ color: "", colorCode: "", sizes: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const primaryImage = form.images && form.images.length > 0 ? form.images[0].url : form.image;
    
    // Check if variants exist to calculate sum stock
    const hasVariants = form.variants && form.variants.length > 0;
    const computedStock = hasVariants
      ? form.variants.reduce((sum, v) => sum + v.sizes.reduce((sSum, s) => sSum + s.stock, 0), 0)
      : Number(form.stock);

    if (!form.name || !form.description || !form.price || (!hasVariants && !form.stock)) {
      setError("All fields are required (including stock if no variants exist)");
      return;
    }

    try {
      setSaving(true);
      const payload = { 
        ...form, 
        image: primaryImage, 
        images: form.images || [],
        price: Number(form.price), 
        stock: computedStock,
        variants: form.variants || []
      };
      if (editProduct) { await updateProductAdminAPI(editProduct._id, payload); }
      else { await createProductAdminAPI(payload); }
      await fetchProducts();
      handleClose();
    } catch (err) { setError(err.response?.data?.message || "Failed to save product"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await deleteProductAdminAPI(id); setProducts(products.filter((p) => p._id !== id)); }
    catch { alert("Failed to delete product"); }
  };

  const handleAIDescription = async () => {
    if (!form.name) { setError("Enter product name first"); return; }
    try {
      setAiLoading(true);
      const { description } = await generateDescriptionAPI(form.name, form.category, form.price);
      setForm((prev) => ({ ...prev, description }));
    } catch { setError("AI description failed"); }
    finally { setAiLoading(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const { url } = await uploadImageAPI(formData);
      const fullUrl = `http://localhost:5000${url}`;
      setForm((prev) => ({ 
        ...prev, 
        images: [...(prev.images || []), { url: fullUrl, alt: prev.name || "" }]
      }));
    } catch (err) { setError("Image upload failed"); }
    finally { setUploading(false); }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold">Products</h1>
            <p className="text-zinc-500 mt-1">{products.length} products</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-bold">{editProduct ? "Edit Product" : "Add Product"}</h2>
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={18} /></button>
              </div>

              {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-500 text-sm">{error}</div>}

              <div className="space-y-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400" />

                {/* Description with AI Button */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</span>
                    <button
                      type="button"
                      onClick={handleAIDescription}
                      disabled={aiLoading}
                      className="text-xs bg-gradient-to-r from-brand-500 to-accent-400 text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <><svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Generating...</>
                      ) : "✨ AI Generate"}
                    </button>
                  </div>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price (₹)"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400" />
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400" />
                </div>

                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400">
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Product Images</span>
                  
                  {/* Upload button and manual input */}
                  <div className="flex items-center gap-3">
                    <input type="file" id="imageUpload" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    <label htmlFor="imageUpload" className="btn-outline text-sm !py-3 flex-1 flex justify-center gap-2 cursor-pointer">
                      {uploading ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <Upload size={16} />}
                      {uploading ? "Uploading..." : "Upload Image"}
                    </label>
                    <div className="flex-1 flex gap-2">
                      <input 
                        value={form.image} 
                        onChange={handleChange} 
                        name="image" 
                        placeholder="Image URL"
                        className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (form.image.trim()) {
                            setForm((prev) => ({
                              ...prev,
                              images: [...(prev.images || []), { url: form.image.trim(), alt: prev.name || "" }],
                              image: "" // clear input
                            }));
                          }
                        }}
                        className="btn-primary px-3 py-3 !rounded-xl"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail List */}
                  {form.images && form.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2 p-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      {form.images.map((img, index) => (
                        <div key={index} className="relative w-16 h-20 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden group">
                          <img src={img.url} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://picsum.photos/seed/broken/60/80'; }} />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = form.images.filter((_, i) => i !== index);
                              setForm(prev => ({
                                ...prev,
                                images: updated
                              }));
                            }}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Variants Section */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 block">Product Variants (Colors & Sizes)</span>
                  
                  {/* Active Variants list */}
                  {form.variants && form.variants.length > 0 && (
                    <div className="space-y-2">
                      {form.variants.map((v, vIdx) => (
                        <div key={vIdx} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm" style={{ backgroundColor: v.colorCode }} />
                            <div>
                              <span className="font-semibold text-sm">{v.color}</span>
                              <div className="flex gap-1.5 flex-wrap mt-1">
                                {v.sizes.map((s) => (
                                  <span key={s.size} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-zinc-500">
                                    {s.size}: {s.stock}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                variants: prev.variants.filter((_, idx) => idx !== vIdx)
                              }));
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add variant sub-form */}
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/20 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-3">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Add Color Variant</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={newVariant.color} 
                        onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                        placeholder="Color Name (e.g. Matte Black)"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:border-brand-400" 
                      />
                      <input 
                        type="text" 
                        value={newVariant.colorCode} 
                        onChange={(e) => setNewVariant({ ...newVariant, colorCode: e.target.value })}
                        placeholder="HEX Code (e.g. #000000)"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:outline-none focus:border-brand-400" 
                      />
                    </div>
                    
                    {/* Sizes inputs */}
                    <div className="grid grid-cols-3 gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                        <div key={sz} className="flex items-center gap-1 bg-white dark:bg-zinc-800/80 px-2 py-1.5 rounded-xl border border-zinc-100 dark:border-zinc-700">
                          <span className="text-[10px] font-bold text-zinc-400 w-6">{sz}</span>
                          <input 
                            type="number"
                            min="0"
                            placeholder="0"
                            value={newVariant.sizes[sz] || ""}
                            onChange={(e) => setNewVariant({
                              ...newVariant,
                              sizes: { ...newVariant.sizes, [sz]: Number(e.target.value) }
                            })}
                            className="w-full bg-transparent text-xs focus:outline-none font-semibold text-right"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newVariant.color.trim() || !newVariant.colorCode.trim()) {
                          alert("Please fill in both Color Name and Color Code");
                          return;
                        }
                        const sizesArray = ["XS", "S", "M", "L", "XL", "XXL"].map((sz) => ({
                          size: sz,
                          stock: newVariant.sizes[sz] || 0
                        }));
                        setForm((prev) => ({
                          ...prev,
                          variants: [...(prev.variants || []), {
                            color: newVariant.color.trim(),
                            colorCode: newVariant.colorCode.trim(),
                            sizes: sizesArray
                          }]
                        }));
                        // Reset sub-form
                        setNewVariant({ color: "", colorCode: "", sizes: {} });
                      }}
                      className="w-full btn-outline !py-2 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Plus size={12} /> Add Variant Color
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleClose} className="flex-1 btn-outline">Cancel</button>
                <button onClick={handleSubmit} disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {saving ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <Save size={16} />}
                  {editProduct ? "Update" : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? <Loader text="Loading products..." /> : (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Product</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Category</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Price</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Stock</th>
                    <th className="text-left p-4 text-sm font-semibold text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-12 object-cover rounded-lg"
                            onError={(e) => { e.target.src = `https://picsum.photos/seed/${product._id}/40/50`; }} />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-zinc-400 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><span className="text-xs bg-brand-500/10 text-brand-500 px-2 py-1 rounded-full font-medium">{product.category}</span></td>
                      <td className="p-4 font-semibold text-sm">₹{product.price.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock === 0 ? "bg-red-100 text-red-600" : product.stock <= 5 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                          {product.stock === 0 ? "Out of Stock" : `${product.stock} units`}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"><Edit2 size={15} /></button>
                          <button onClick={() => handleDelete(product._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProducts;