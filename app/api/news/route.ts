import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchWebDevNewsServer } from "@/lib/newsServer";

const TTL_SECONDS = 30 * 60;

const getCachedNews = unstable_cache(
  async (skip: number) => fetchWebDevNewsServer(skip),
  ["webdev-times-news"],
  { revalidate: TTL_SECONDS }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skipRaw = searchParams.get("skip") ?? "0";
  const skip = Number.parseInt(skipRaw, 10);

  if (!Number.isFinite(skip) || skip < 0) {
    return NextResponse.json({ error: "Invalid skip" }, { status: 400 });
  }

  try {
    const news = await getCachedNews(skip);

    return NextResponse.json(news, {
      headers: {
        "Cache-Control": `public, max-age=0, s-maxage=${TTL_SECONDS}, stale-while-revalidate=${TTL_SECONDS}`,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

