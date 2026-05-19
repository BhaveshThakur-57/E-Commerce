const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are a helpful customer support assistant for AURAWEAR, a modern fashion e-commerce store.
AURAWEAR sells: Tops, Bottoms, Outerwear, Footwear, Accessories.
Price range: ₹799 to ₹1999.
Features: Free shipping above ₹999, 30-day returns, Razorpay payment, GST 18% included.
Answer only questions related to products, pricing, shipping, returns, orders, payment.
Keep answers short, friendly and helpful. Use Indian Rupee (₹) for prices.
Customer message: ${message}`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ message: "AI service unavailable. Please try again." });
  }
};

module.exports = { chat };