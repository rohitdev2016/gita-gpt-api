// pages/api/gpt.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question, languages } = req.body;

  const systemPrompt = `
You are a compassionate spiritual guide. For each user question, return answers in this JSON format:

{
  "english": "...",
  "hindi": "...",
  "telugu": "..."
}

Each language should include:
- A Bhagavad Gita verse (with chapter and verse number)
- A brief explanation in that language

If a language is not requested, leave it out.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4", // or "gpt-3.5-turbo"
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Question: ${question}\nLanguages: ${languages.join(", ")}` }
    ]
  });

  const text = completion.choices[0].message?.content || "{}";
  const responses = JSON.parse(text);

  res.status(200).json({ responses });
}
