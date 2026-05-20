const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generateDescription = async (req, res) => {
  const { name, category, price } = req.body;
  if (!name) return res.status(400).json({ message: "Product name required" });
  try {
    const model = getModel();
    const prompt = `Write a compelling product description for an Indian streetwear clothing brand called LUXORA.
Product: ${name}
Category: ${category || "Clothing"}
Price: ₹${price || ""}
Keep it 2-3 sentences, modern, stylish tone. No bullet points. Max 100 words.`;
    const result = await model.generateContent(prompt);
    res.json({ description: result.response.text() });
  } catch (error) {
    console.error("Description error:", error.message);
    res.status(500).json({ message: "AI service unavailable" });
  }
};

const smartSearch = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Query required" });
  try {
    const products = await Product.find({});
    const model = getModel();
    const prompt = `You are a search engine for LUXORA clothing store.
User searched: "${q}"
Available products: ${JSON.stringify(products.map((p) => ({ id: p._id.toString(), name: p.name, category: p.category, price: p.price })))}
Return ONLY a raw JSON array of product IDs that match. Max 6 results. No markdown, no explanation.
Example output: ["id1","id2"]`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim().replace(/```json|```/g, "").trim();
    const ids = JSON.parse(text);
    const matched = products.filter((p) => ids.includes(p._id.toString()));
    res.json(matched);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Search failed" });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.productId);
    if (!currentProduct) return res.status(404).json({ message: "Product not found" });

    const allProducts = await Product.find({ _id: { $ne: req.params.productId } });
    const model = getModel();
    const prompt = `You are a recommendation engine for LUXORA clothing store.
Current product: ${JSON.stringify({ name: currentProduct.name, category: currentProduct.category, price: currentProduct.price })}
Other products: ${JSON.stringify(allProducts.map((p) => ({ id: p._id.toString(), name: p.name, category: p.category, price: p.price })))}
Return ONLY a raw JSON array of 4 product IDs most similar or complementary. No markdown, no explanation.
Example output: ["id1","id2","id3","id4"]`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim().replace(/```json|```/g, "").trim();
    const ids = JSON.parse(text);
    const recommended = allProducts.filter((p) => ids.includes(p._id.toString()));
    res.json(recommended);
  } catch (error) {
    console.error("Recommendations error:", error.message);
    res.status(500).json({ message: "Recommendations failed" });
  }
};

module.exports = { generateDescription, smartSearch, getRecommendations };