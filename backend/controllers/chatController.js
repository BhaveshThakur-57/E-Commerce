const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a modern fashion brand assistant for LUXORA ("Wear the Extraordinary"), a premium clothing brand.
LUXORA sells premium clothing: Streetwear, Essentials, Oversized Fits, Urban Classics, Summer Drop, Winter Layers, Premium Cotton, Limited Edition.
Features: Premium fabric quality, 30-day returns, Secure payment.
Answer questions confidently with a modern, stylish, and helpful tone. Provide sizing advice (e.g. oversized fits), styling suggestions, fabric details, and order tracking info.
Keep answers short, chic, and helpful. Use Indian Rupee (₹) or USD ($) based on context.
Customer message: ${message}`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ message: "AI service unavailable. Please try again." });
  }
};

module.exports = { chat };