import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/gpt", async (req, res) => {
  const { question, languages } = req.body;

  if (!question || !Array.isArray(languages) || languages.length === 0) {
    return res.status(400).json({ error: "Missing question or languages." });
  }

  const systemPrompt = `
You are a compassionate spiritual guide. 
Respond with Gita wisdom in: ${languages.join(", ")}.
Return JSON format: { english: "...", hindi: "...", telugu: "..." }
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(responseText);
    res.json({ responses: parsed });
  } catch (error: any) {
    console.error("GPT error:", error);
    res.status(500).json({ error: "OpenAI request failed", detail: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
