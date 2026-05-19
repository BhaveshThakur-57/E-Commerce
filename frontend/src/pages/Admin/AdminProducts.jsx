import { useState, useEffect } from "react";
import { getProductsAPI } from "../../services/productService";
import { createProductAdminAPI, updateProductAdminAPI, deleteProductAdminAPI } from "../../services/adminService";
import { generateDescriptionAPI } from "../../services/aiService";
import Loader from "../../components/Loader";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";

const CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"];
const emptyForm = { name: "", description: "", price: "", image: "", category: "Tops", stock: "" };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

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
    setForm({ name: product.name, description: product.description, price: product.price, image: product.image, category: product.category, stock: product.stock });
    setShowForm(true);
  };

  const handleClose = () => { setShowForm(false); setEditProduct(null); setForm(emptyForm); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.description || !form.price || !form.stock) { setError("All fields are required"); return; }
    try {
      setSaving(true);
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
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

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-2">Admin Panel</p>
            <h1 className="font-display text-4xl font-bold">Products</h1>
            <p className="text-zinc-500 mt-1">{products.length} products</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-scale-in">
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

                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL (optional)"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-400" />
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
      </div>
    </main>
  );
};

export default AdminProducts;