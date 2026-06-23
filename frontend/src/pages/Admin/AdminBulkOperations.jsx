import { useState, useEffect, useRef } from "react";
import { 
  getProductsAPI 
} from "../../services/productService";
import { 
  bulkUpdateStockAPI, 
  bulkUploadProductsAPI,
  getAllOrdersAdminAPI 
} from "../../services/adminService";
import AdminSidebar from "../../components/AdminSidebar";
import Loader from "../../components/Loader";
import { Save, Upload, Download, FileSpreadsheet, PackageSearch, CheckCircle, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const AdminBulkOperations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stock"); // 'stock', 'import', 'export'
  const [stockUpdates, setStockUpdates] = useState({});
  const [savingStock, setSavingStock] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  // Import state
  const [csvData, setCsvData] = useState([]);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsAPI();
      setProducts(data);
      
      // Initialize stock updates state
      const initialUpdates = {};
      data.forEach(p => {
        initialUpdates[p._id] = { stock: p.stock, price: p.price };
      });
      setStockUpdates(initialUpdates);
    } catch (err) {
      showFeedback("error", "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleStockChange = (id, field, value) => {
    setStockUpdates(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: Number(value) }
    }));
  };

  const saveBulkStock = async () => {
    try {
      setSavingStock(true);
      // Only send changed items to save bandwidth
      const changedUpdates = [];
      products.forEach(p => {
        const update = stockUpdates[p._id];
        if (update && (update.stock !== p.stock || update.price !== p.price)) {
          changedUpdates.push({ _id: p._id, stock: update.stock, price: update.price });
        }
      });

      if (changedUpdates.length === 0) {
        showFeedback("success", "No changes to save.");
        setSavingStock(false);
        return;
      }

      await bulkUpdateStockAPI(changedUpdates);
      showFeedback("success", `Successfully updated ${changedUpdates.length} products.`);
      fetchProducts();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to update stock");
    } finally {
      setSavingStock(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Basic validation
        const requiredHeaders = ["name", "description", "price", "category"];
        const headers = results.meta.fields;
        const missing = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missing.length > 0) {
          showFeedback("error", `Missing required columns: ${missing.join(", ")}`);
          return;
        }

        const formattedData = results.data.map(row => ({
          name: row.name,
          description: row.description,
          price: Number(row.price) || 0,
          category: row.category,
          stock: Number(row.stock) || 0,
          image: row.image || "",
          collections: row.collections ? row.collections.split(",").map(c => c.trim()) : [],
        }));

        setCsvData(formattedData);
      },
      error: (error) => {
        showFeedback("error", `Error parsing CSV: ${error.message}`);
      }
    });
  };

  const processImport = async () => {
    if (csvData.length === 0) return;
    try {
      setImporting(true);
      await bulkUploadProductsAPI(csvData);
      showFeedback("success", `Successfully imported ${csvData.length} products.`);
      setCsvData([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchProducts();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to import products");
    } finally {
      setImporting(false);
    }
  };

  const exportOrders = async () => {
    try {
      showFeedback("success", "Generating export...");
      const orders = await getAllOrdersAdminAPI();
      
      const exportData = orders.map(order => ({
        OrderID: order.orderId,
        Date: new Date(order.createdAt).toLocaleDateString(),
        CustomerName: order.shippingAddress?.fullName || order.user?.name,
        CustomerEmail: order.user?.email,
        Phone: order.shippingAddress?.phone,
        Status: order.orderStatus,
        Payment: order.paymentStatus,
        Subtotal: order.subtotal,
        Tax: order.tax,
        Total: order.totalPrice,
        ItemsCount: order.items?.length || 0
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      XLSX.writeFile(workbook, `Luxora_Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
      
    } catch (err) {
      showFeedback("error", "Failed to export orders");
    }
  };

  const exportProducts = () => {
    const exportData = products.map(p => ({
      ID: p._id,
      Name: p.name,
      Category: p.category,
      Price: p.price,
      Stock: p.stock,
      Status: p.stock > 0 ? "In Stock" : "Out of Stock"
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, `Luxora_Products_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading && products.length === 0) return <div className="pt-28"><Loader text="Loading inventory..." /></div>;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <FileSpreadsheet className="text-brand-500" /> Bulk Operations
            </h1>
            <p className="text-zinc-500 mt-1">Manage inventory, import products, and export data efficiently</p>
          </div>
        </div>

        {feedback.message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-medium ${
            feedback.type === "success" 
              ? "bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800" 
              : "bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800"
          }`}>
            {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {feedback.message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-100 dark:border-zinc-800 w-fit">
          <button 
            onClick={() => setActiveTab("stock")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "stock" ? "bg-zinc-100 dark:bg-zinc-800 text-brand-500 shadow-sm" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <PackageSearch size={16} /> Bulk Edit Stock
          </button>
          <button 
            onClick={() => setActiveTab("import")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "import" ? "bg-zinc-100 dark:bg-zinc-800 text-brand-500 shadow-sm" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Upload size={16} /> Import Products
          </button>
          <button 
            onClick={() => setActiveTab("export")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "export" ? "bg-zinc-100 dark:bg-zinc-800 text-brand-500 shadow-sm" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Download size={16} /> Export Data
          </button>
        </div>

        {/* Tab Content: Bulk Edit Stock */}
        {activeTab === "stock" && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <p className="text-sm text-zinc-500">Fast inline editing for stock and price.</p>
              <button 
                onClick={saveBulkStock} 
                disabled={savingStock}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2 shadow-lg shadow-brand-500/20"
              >
                {savingStock ? <Loader text="" /> : <Save size={16} />} 
                Save All Changes
              </button>
            </div>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              <table className="w-full relative">
                <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10 shadow-sm">
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product Name</th>
                    <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                    <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-32">Price (₹)</th>
                    <th className="text-left p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-32">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image || "https://via.placeholder.com/40"} alt="" className="w-8 h-8 rounded object-cover" />
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-zinc-500">{product.category}</td>
                      <td className="p-3">
                        <input 
                          type="number" 
                          value={stockUpdates[product._id]?.price ?? ""}
                          onChange={(e) => handleStockChange(product._id, "price", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-brand-500"
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="number" 
                          value={stockUpdates[product._id]?.stock ?? ""}
                          onChange={(e) => handleStockChange(product._id, "stock", e.target.value)}
                          className={`w-full px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:border-brand-500 ${
                            stockUpdates[product._id]?.stock <= 5 
                              ? "border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-900/20" 
                              : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Import */}
        {activeTab === "import" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4">
                <Upload size={24} className="text-brand-500" />
              </div>
              <h2 className="text-xl font-display font-bold mb-2">Upload CSV File</h2>
              <p className="text-sm text-zinc-500 mb-6">Import bulk products using a CSV file. Make sure headers match: name, description, price, category, stock.</p>
              
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                id="csvUpload" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <label htmlFor="csvUpload" className="btn-outline cursor-pointer mb-4">
                Select CSV File
              </label>
              <a href="data:text/csv;charset=utf-8,name,description,price,category,stock,image,collections%0AProduct 1,Description 1,999,T-Shirts,10,,Streetwear" download="template.csv" className="text-xs text-brand-500 hover:underline">
                Download Template CSV
              </a>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col">
              <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                Preview Data
                {csvData.length > 0 && <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">{csvData.length} Valid Rows</span>}
              </h2>
              
              {csvData.length > 0 ? (
                <>
                  <div className="flex-grow overflow-auto max-h-[300px] bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 mb-4 font-mono text-xs">
                    {csvData.slice(0, 5).map((row, i) => (
                      <div key={i} className="mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="font-bold text-brand-500">{row.name}</span> | ₹{row.price} | Stock: {row.stock} | {row.category}
                      </div>
                    ))}
                    {csvData.length > 5 && <div className="text-zinc-500 italic mt-2">... and {csvData.length - 5} more rows</div>}
                  </div>
                  <button onClick={processImport} disabled={importing} className="btn-primary w-full flex justify-center items-center gap-2">
                    {importing ? <Loader text="" /> : <Save size={18} />} Import {csvData.length} Products
                  </button>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-sm text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center">
                  Select a CSV file to preview data before importing.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Export */}
        {activeTab === "export" && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center hover:border-brand-400/50 transition-colors group">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download size={24} className="text-blue-500" />
              </div>
              <h2 className="text-xl font-display font-bold mb-2">Export Orders</h2>
              <p className="text-sm text-zinc-500 mb-6">Download all orders as an Excel spreadsheet for accounting and fulfillment.</p>
              <button onClick={exportOrders} className="btn-outline w-full text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-900/30">
                Download Orders (.xlsx)
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center hover:border-brand-400/50 transition-colors group">
              <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PackageSearch size={24} className="text-brand-500" />
              </div>
              <h2 className="text-xl font-display font-bold mb-2">Export Products</h2>
              <p className="text-sm text-zinc-500 mb-6">Download your entire product catalog including current stock levels and prices.</p>
              <button onClick={exportProducts} className="btn-outline w-full">
                Download Products (.xlsx)
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminBulkOperations;
