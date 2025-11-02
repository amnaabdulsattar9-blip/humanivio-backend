// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Health check route ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "✅ Humanivio API is live and running!",
  });
});

// --- Main Humanize endpoint ---
app.post("/api/humanize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided." });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: text }],
    });

    const output = response.choices?.[0]?.message?.content || "No response.";
    res.json({ humanized: output });
  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Humanivio API running on port ${PORT}`);
});
