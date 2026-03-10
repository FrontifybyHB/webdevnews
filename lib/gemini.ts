import Groq from "groq-sdk";
import { NewsItem } from "@/types/news";
import { SYSTEM_PERSONA, TOPICS, WRITING_STYLE } from "@/lib/prompt";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";

export async function fetchWebDevNews(skip: number = 0): Promise<NewsItem[]> {
    if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
        throw new Error("NEXT_PUBLIC_GROQ_API_KEY not set — add it to .env.local");
    }

    const client = new Groq({
        apiKey: GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    const prompt = `
${SYSTEM_PERSONA}

Return ONLY a valid JSON array of exactly 10 news items. No markdown, no explanation, just raw JSON.

Each item must follow this exact structure:
{
  "id": number (${skip + 1} through ${skip + 10}),
  "category": one of ["AI Models", "Dev Tools", "Frontend", "Backend", "Design", "Strategy"],
  "tag": one of ["BREAKING", "HOT", "TRENDING", "NEW", "INSIGHT", "TOOLS"],
  "headline": "Short catchy headline in Hinglish, max 8 words",
  "subheadline": "English subtitle, max 12 words",
  "summary": "3-4 sentences in Hinglish style as described below",
  "detail": "2-3 sentences of practical developer insight",
  "emoji": "one relevant emoji",
  "readTime": "X min",
  "accentColor": "hex color matching the category mood"
}

Today's date: ${new Date().toDateString()}

TOPICS TO COVER:
${TOPICS}

WRITING STYLE:
${WRITING_STYLE}

${skip > 0
            ? `IMPORTANT: Skip the most obvious/popular ${skip} stories already covered. Give the NEXT batch of important but less-covered stories.`
            : "Start with the most important and impactful stories of today."
        }

Return ONLY the JSON array. No backticks. No explanation. Just [...].
    `.trim();

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const completion = await client.chat.completions.create({
                model: MODEL,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 4096,
            });

            const text = completion.choices[0]?.message?.content ?? "";

            // Strip any accidental markdown fences
            const cleaned = text
                .replace(/```json\s*/gi, "")
                .replace(/```\s*/gi, "")
                .trim();

            const parsed = JSON.parse(cleaned) as NewsItem[];
            return parsed;
        } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (attempt === 0) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }

    throw lastError ?? new Error("Failed to fetch news after 2 attempts");
}
