import "server-only";

import Groq from "groq-sdk";
import { NewsItem } from "@/types/news";
import {
  SYSTEM_PERSONA,
  TOPICS,
  WRITING_STYLE,
  FRESHNESS_INSTRUCTION,
  JSON_CONTRACT,
} from "@/lib/prompt";

const MODEL = "llama-3.3-70b-versatile";

function getClient(): Groq {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY not set — add it to .env.local");
  }
  return new Groq({ apiKey: key });
}

// ── Prompt builders ────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return [
    SYSTEM_PERSONA,
    FRESHNESS_INSTRUCTION,
    WRITING_STYLE,
  ].join("\n\n---\n\n");
}

function buildUserPrompt(skip: number): string {
  const now = new Date();
  const dateStr = now.toDateString();
  const timeIST = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });

  const skipInstruction =
    skip > 0
      ? `Generate the NEXT 10 stories. Skip the ${skip} most prominent stories already covered in the previous batch. Find less-covered but equally important news — go deeper into the ecosystem.`
      : `Generate the TOP 10 most important, specific, and developer-relevant stories from this week.`;

  const idRange = `IDs must be ${skip + 1} through ${skip + 10}.`;

  return [
    `TODAY: ${dateStr}, ${timeIST} IST`,
    skipInstruction,
    idRange,
    TOPICS,
    JSON_CONTRACT,
  ]
    .filter(Boolean)
    .join("\n\n");
}

// ── JSON extraction (handles partial/wrapped responses) ───────────────────

function extractJSON(raw: string): string {
  // Strip markdown fences
  let text = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  // Find the outermost [...] array
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }

  return text;
}

// ── Validator — catches malformed items before they reach the UI ──────────

function validateAndRepair(items: unknown[]): NewsItem[] {
  const VALID_CATEGORIES = new Set([
    "AI Models", "Dev Tools", "Frontend",
    "Backend", "Design", "Strategy",
  ]);
  const VALID_TAGS = new Set([
    "BREAKING", "HOT", "TRENDING", "NEW", "INSIGHT", "TOOLS",
  ]);
  const DEFAULT_COLORS: Record<string, string> = {
    "AI Models": "#FF4B2B",
    "Dev Tools": "#A855F7",
    "Frontend":  "#3B82F6",
    "Backend":   "#10B981",
    "Design":    "#F59E0B",
    "Strategy":  "#EC4899",
  };

  return items
    .filter((item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null
    )
    .map((item, index) => {
      const category = VALID_CATEGORIES.has(item.category as string)
        ? (item.category as NewsItem["category"])
        : "Strategy";

      const tag = VALID_TAGS.has(item.tag as string)
        ? (item.tag as NewsItem["tag"])
        : "NEW";

      const accentColor =
        typeof item.accentColor === "string" &&
        /^#[0-9A-Fa-f]{6}$/.test(item.accentColor)
          ? item.accentColor
          : DEFAULT_COLORS[category] ?? "#A855F7";

      return {
        id:           typeof item.id === "number" ? item.id : index + 1,
        category,
        tag,
        headline:     String(item.headline     ?? "Naya Update Aaya"),
        subheadline:  String(item.subheadline  ?? "Details aa rahe hain"),
        summary:      String(item.summary      ?? ""),
        detail:       String(item.detail       ?? ""),
        emoji:        String(item.emoji        ?? "📰"),
        readTime:     String(item.readTime     ?? "3 min"),
        accentColor,
      } satisfies NewsItem;
    })
    .filter((item) => item.summary.length > 20 && item.headline.length > 5);
}

// ── Main export ────────────────────────────────────────────────────────────

export async function fetchWebDevNewsServer(
  skip: number = 0
): Promise<NewsItem[]> {
  const client = getClient();
  const systemPrompt = buildSystemPrompt();
  const userPrompt   = buildUserPrompt(skip);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt   },
        ],
        // Slightly higher temp = more unique angles, less repetition
        temperature: attempt === 0 ? 0.85 : 0.7,
        max_tokens:  5000,
        // Force JSON on Groq-supported models
        response_format: { type: "json_object" },
      });

      const raw     = completion.choices[0]?.message?.content ?? "";
      const cleaned = extractJSON(raw);
      const parsed  = JSON.parse(cleaned);

      // Groq json_object mode sometimes wraps in { "news": [...] }
      const array: unknown[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.news)
        ? parsed.news
        : Array.isArray(parsed?.items)
        ? parsed.items
        : Array.isArray(parsed?.stories)
        ? parsed.stories
        : [];

      if (array.length === 0) {
        throw new Error("AI returned empty array — retrying");
      }

      const validated = validateAndRepair(array);

      if (validated.length < 5) {
        throw new Error(
          `Only ${validated.length} valid items after repair — retrying`
        );
      }

      return validated;

    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Exponential back-off: 1s, 2s, then throw
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error("fetchWebDevNewsServer: all 3 attempts failed");
}