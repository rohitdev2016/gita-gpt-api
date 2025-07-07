import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { question, languages } = req.body;

  if (!question || !languages?.length) {
    return res.status(400).json({ error: "Missing input" });
  }

  const systemPrompt = `
You are a compassionate spiritual guide. Respond to this question with Bhagavad Gita verses and spiritual insight in these languages: ${languages.join(", ")}.
Return your response as a JSON object like:
{
  "english": "...",
  "hindi": "...",
  "telugu": "..."
}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ]
    });

    const content = completion.choices[0].message?.content;
    const json = JSON.parse(content);

    return res.status(200).json({ responses: json });
  } catch (err) {
    console.error("GPT API error:", err.message);
    return res.status(500).json({ error: "GPT failed" });
  }
});

export default router;
