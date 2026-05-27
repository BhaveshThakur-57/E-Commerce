const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model fallback chain — tries each in order
const MODEL_CHAIN = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-pro"];

// Retry helper with model fallback
const generateWithRetry = async (prompt, maxRetries = 2) => {
  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        lastError = error;
        const status = error.status || error.httpStatusCode;

        // 503 = overloaded, 429 = rate limit — retry with delay
        if (status === 503 || status === 429) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          console.log(`AI ${modelName} attempt ${attempt + 1} failed (${status}), retrying in ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        // Other errors (400, 404, etc.) — skip to next model
        console.log(`AI ${modelName} failed with ${status}, trying next model...`);
        break;
      }
    }
  }

  throw lastError || new Error("All AI models failed");
};

const generateDescription = async (req, res) => {
  const { name, category, price } = req.body;
  if (!name) return res.status(400).json({ message: "Product name required" });
  try {
    const priceInstruction = price ? `Price: ₹${price}` : "Price: Not set yet — do NOT mention any price in the description.";
    const prompt = `Write a compelling product description for an Indian streetwear clothing brand called LUXORA.
Product: ${name}
Category: ${category || "Clothing"}
${priceInstruction}
Keep it 2-3 sentences, modern, stylish tone. No bullet points. Max 100 words. Do not include any pricing or cost information unless a specific price was provided above.`;
    const text = await generateWithRetry(prompt);
    res.json({ description: text });
  } catch (error) {
    console.error("Description error:", error.message);
    res.status(500).json({ message: "AI service unavailable. Please try again in a moment." });
  }
};

const smartSearch = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Query required" });
  try {
    const products = await Product.find({});

    // If no products, return empty
    if (products.length === 0) return res.json([]);

    const prompt = `You are a search engine for LUXORA clothing store.
User searched: "${q}"
Available products: ${JSON.stringify(products.map((p) => ({ id: p._id.toString(), name: p.name, category: p.category, price: p.price })))}
Return ONLY a raw JSON array of product IDs that match. Max 6 results. No markdown, no explanation.
Example output: ["id1","id2"]`;

    const text = await generateWithRetry(prompt);
    let cleaned = text.trim().replace(/```json|```/g, "").trim();
    const ids = JSON.parse(cleaned);
    const matched = products.filter((p) => ids.includes(p._id.toString()));
    res.json(matched);
  } catch (error) {
    console.error("Search error:", error.message);

    // Fallback: simple text-based search if AI fails
    try {
      const regex = new RegExp(q, "i");
      const fallbackResults = await Product.find({
        $or: [
          { name: regex },
          { category: regex },
          { description: regex },
        ],
      }).limit(6);
      res.json(fallbackResults);
    } catch {
      res.status(500).json({ message: "Search failed" });
    }
  }
};

const getRecommendations = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.productId);
    if (!currentProduct) return res.status(404).json({ message: "Product not found" });

    const allProducts = await Product.find({ _id: { $ne: req.params.productId } });

    if (allProducts.length === 0) return res.json([]);

    const prompt = `You are a recommendation engine for LUXORA clothing store.
Current product: ${JSON.stringify({ name: currentProduct.name, category: currentProduct.category, price: currentProduct.price })}
Other products: ${JSON.stringify(allProducts.map((p) => ({ id: p._id.toString(), name: p.name, category: p.category, price: p.price })))}
Return ONLY a raw JSON array of 4 product IDs most similar or complementary. No markdown, no explanation.
Example output: ["id1","id2","id3","id4"]`;

    const text = await generateWithRetry(prompt);
    let cleaned = text.trim().replace(/```json|```/g, "").trim();
    const ids = JSON.parse(cleaned);
    const recommended = allProducts.filter((p) => ids.includes(p._id.toString()));
    res.json(recommended);
  } catch (error) {
    console.error("Recommendations error:", error.message);

    // Fallback: return same-category products
    try {
      const currentProduct = await Product.findById(req.params.productId);
      const fallback = await Product.find({
        _id: { $ne: req.params.productId },
        category: currentProduct?.category,
      }).limit(4);
      res.json(fallback);
    } catch {
      res.status(500).json({ message: "Recommendations failed" });
    }
  }
};

module.exports = { generateDescription, smartSearch, getRecommendations };