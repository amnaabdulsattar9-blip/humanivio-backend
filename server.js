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
app.post('/api/humanize', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that rewrites text to make it sound more natural, human, and emotionally engaging. You do not add new information — just make the tone conversational and human-like.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    res.json({ humanizedText: response.choices[0].message.content });
  } catch (error) {
    console.error("Error humanizing text:", error.message);
    res.status(500).json({ error: "Failed to humanize text." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Humanivio API running on port ${PORT}`);
});
