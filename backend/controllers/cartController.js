const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper: get stock for specific size+color
const getVariantStock = (product, size, color) => {
  if (!product.variants || product.variants.length === 0) {
    return product.stock;
  }
  const variant = product.variants.find(
    (v) => v.color.toLowerCase() === color.toLowerCase()
  );
  if (!variant) return 0;
  const sizeObj = variant.sizes.find((s) => s.size === size);
  return sizeObj ? sizeObj.stock : 0;
};

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
  const { productId, qty = 1, size = "", color = "", colorCode = "" } =
    req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Stock check
    const availableStock =
      product.variants && product.variants.length > 0
        ? getVariantStock(product, size, color)
        : product.stock;

    if (availableStock === 0) {
      return res.status(400).json({ message: "This variant is out of stock" });
    }
    if (qty > availableStock) {
      return res
        .status(400)
        .json({ message: `Only ${availableStock} items available` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if same product + size + color already in cart
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      const newQty = existingItem.qty + qty;
      if (newQty > availableStock) {
        return res
          .status(400)
          .json({ message: `Only ${availableStock} items available` });
      }
      existingItem.qty = newQty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: availableStock,
        qty,
        size,
        color,
        colorCode,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item qty
// @route   PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  const { qty } = req.body;
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (qty <= 0) {
      cart.items.pull(itemId);
    } else {
      if (qty > item.stock) {
        return res
          .status(400)
          .json({ message: `Only ${item.stock} items available` });
      }
      item.qty = qty;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};