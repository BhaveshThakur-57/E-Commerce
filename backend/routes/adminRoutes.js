const express = require("express");
const router = express.Router();
const { getDashboardStats, getAllUsers } = require("../controllers/adminController");
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { getAllSettings, updateAnnouncement, updateBanners, updatePageContent } = require("../controllers/settingsController");
const { getAllInquiries, getInquiryById, replyToInquiry, updateInquiryStatus, deleteInquiry } = require("../controllers/inquiryController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);

router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Settings (CMS)
router.get("/settings", getAllSettings);
router.put("/settings/announcement", updateAnnouncement);
router.put("/settings/banners", updateBanners);
router.put("/settings/pages/:page", updatePageContent);

// Inquiries
router.get("/inquiries", getAllInquiries);
router.get("/inquiries/:id", getInquiryById);
router.put("/inquiries/:id/reply", replyToInquiry);
router.put("/inquiries/:id/status", updateInquiryStatus);
router.delete("/inquiries/:id", deleteInquiry);

module.exports = router;