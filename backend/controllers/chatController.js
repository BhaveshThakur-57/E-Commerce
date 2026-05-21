const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model fallback chain
const MODEL_CHAIN = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3-flash-preview"];

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

        if (status === 503 || status === 429) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          console.log(`Chat ${modelName} attempt ${attempt + 1} failed (${status}), retrying in ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        break;
      }
    }
  }

  throw lastError || new Error("All AI models failed");
};

const chat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    const prompt = `You are a modern fashion brand assistant for LUXORA ("Wear the Extraordinary"), a premium clothing brand.
LUXORA sells premium clothing: Streetwear, Essentials, Oversized Fits, Urban Classics, Summer Drop, Winter Layers, Premium Cotton, Limited Edition.
Features: Premium fabric quality, 30-day returns, Secure payment.
Answer questions confidently with a modern, stylish, and helpful tone. Provide sizing advice (e.g. oversized fits), styling suggestions, fabric details, and order tracking info.
Keep answers short, chic, and helpful. Use Indian Rupee (₹) or USD ($) based on context.
Customer message: ${message}`;

    const reply = await generateWithRetry(prompt);
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ message: "AI service temporarily unavailable. Please try again in a moment." });
  }
};

module.exports = { chat };