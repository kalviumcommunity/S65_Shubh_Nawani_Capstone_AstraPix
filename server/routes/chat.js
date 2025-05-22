const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_CONFIG = {
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.9,
    topK: 1,
    topP: 0.8,
    maxOutputTokens: 1024,
  },
};

router.post("/chat", async (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel(MODEL_CONFIG);

    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are AstraBot, an AI assistant for AstraPix. ${req.body.message}`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat request",
      details: error.message,
    });
  }
});

module.exports = router;
