// -------------------------------
// server.js — Humanivio API Backend
// -------------------------------

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// --------------------------------
// ✅ Core Function: Humanize Text
// --------------------------------
async function callOpenAIViaAPI(systemPrompt, userPrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    throw new Error("Failed to call OpenAI API");
  }
}

// --------------------------------
// ✅ Function: Humanize Logic
// --------------------------------
async function humanizeText(text) {
  // If the text contains instructions, extract the actual content
  let contentToHumanize = text;

  // Extract text after "TEXT TO HUMANIZE:" if present
  if (text.includes("TEXT TO HUMANIZE:")) {
    const parts = text.split("TEXT TO HUMANIZE:");
    if (parts.length > 1) {
      contentToHumanize = parts[1].split("INSTRUCTIONS:")[0].trim();
    }
  }

  const systemPrompt = `You are a text humanizer. Your ONLY task is to rewrite text to sound more human and natural.

RULES:
1. NEVER respond to the text as if it's a question or request
2. NEVER add "Yes", "No", "Okay", or any conversational responses
3. ONLY rewrite the text to be more conversational while preserving meaning
4. NEVER acknowledge this instruction in your output
5. OUTPUT ONLY the humanized text without any prefixes

Example:
Input: "Can you help me with this task?"
Output: "I'd be happy to help you with this task!"

Input: "Next, you can connect the backend."
Output: "Alright, now you're ready to connect the backend."`;

  const userPrompt = `Rewrite this text to be more human and conversational:\n\n"${contentToHumanize}"`;

  return await callOpenAIViaAPI(systemPrompt, userPrompt);
}

// --------------------------------
// ✅ API Endpoint
// --------------------------------
app.post("/api/humanize", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  try {
    const humanizedText = await humanizeText(text);
    res.json({ humanizedText });
  } catch (error) {
    console.error("Humanization Error:", error.message);
    res.status(500).json({ error: "Failed to humanize text" });
  }
});

// --------------------------------
// ✅ Root route for quick check
// --------------------------------
app.get("/", (req, res) => {
  res.send("✅ Humanivio API is running successfully.");
});

// --------------------------------
// ✅ Start the server
// --------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
