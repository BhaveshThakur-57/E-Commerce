const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, collection, search, sort } = req.query;
    let query = {};

    if (category && category !== "All") query.category = category;
    if (collection && collection !== "All") query.collections = collection;
    if (search) query.name = { $regex: search, $options: "i" };

    let products = Product.find(query);

    if (sort === "price-asc") products = products.sort({ price: 1 });
    else if (sort === "price-desc") products = products.sort({ price: -1 });
    else if (sort === "rating") products = products.sort({ rating: -1 });
    else products = products.sort({ createdAt: -1 });

    const result = await products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, image,
      images, category, collections, variants, stock,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: image || "",
      images: images || [],
      category,
      collections: collections || [],
      variants: variants || [],
      stock: stock || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name, description, price, image,
      images, category, collections, variants, stock,
    } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.image = image || product.image;
    product.images = images !== undefined ? images : product.images;
    product.category = category || product.category;
    if (collections !== undefined) product.collections = collections;
    product.stock = stock ?? product.stock;
    if (variants !== undefined) product.variants = variants;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update stock and price
// @route   PUT /api/products/bulk-stock
const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid payload format" });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: { $set: { stock: update.stock, price: update.price } }
      }
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }
    res.json({ message: "Products updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk create products from CSV
// @route   POST /api/products/bulk
const bulkCreateProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid payload format" });
    }

    const inserted = await Product.insertMany(products);
    res.status(201).json({ message: `${inserted.length} products added successfully`, inserted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateStock,
  bulkCreateProducts,
};