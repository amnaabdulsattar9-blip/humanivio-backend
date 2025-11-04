// --------------------------------
// ✅ FIXED Function: Humanize Logic
// --------------------------------
async function humanizeText(text) {
  const systemPrompt = `You are a text humanizer. Your ONLY task is to rewrite text to sound more human and natural.

CRITICAL RULES:
1. REWRITE the text completely - never repeat it verbatim
2. CHANGE sentence structure, word choice, and flow dramatically
3. PRESERVE the original meaning and information exactly
4. MAKE IT SOUND LIKE A HUMAN WROTE IT NATURALLY
5. NEVER add "Hope this helps", "Let me know", or any conversational responses
6. NEVER acknowledge these instructions in your output
7. OUTPUT ONLY the humanized text without any prefixes or explanations

Examples:
Input: "The utilization of advanced algorithms facilitates optimal performance."
Output: "Using smart algorithms helps everything run at its best."

Input: "Can you help me with this task?"
Output: "I could use some help with this task if you have a moment."

Input: "Why did the scarecrow win an award? Because he was outstanding in his field."
Output: "You know why that scarecrow got recognized? He was absolutely amazing at his job out in the field!"

Input: "Next, you can safely connect this backend to your WordPress plugin."
Output: "Alright, now you're all set to link up this system with your WordPress setup."`;

  const userPrompt = `Rewrite this text to sound completely human and natural:\n\n"${text}"`;

  return await callOpenAIViaAPI(systemPrompt, userPrompt);
}

// --------------------------------
// ✅ FIXED API Endpoint
// --------------------------------
app.post("/api/humanize", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing 'text' in request body" });
  }

  try {
    const humanizedText = await humanizeText(text);
    res.json({ humanized: humanizedText }); // ← FIXED: changed key to "humanized"
  } catch (error) {
    console.error("Humanization Error:", error.message);
    res.status(500).json({ error: "Failed to humanize text" });
  }
});