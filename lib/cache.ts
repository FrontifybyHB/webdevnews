import { NewsItem } from "@/types/news";

const CACHE_KEY = "webdev_times_news";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function getCachedNews(): NewsItem[] | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { news, fetchedAt } = JSON.parse(raw);
        if (Date.now() - fetchedAt > CACHE_DURATION) return null;
        return news;
    } catch {
        return null;
    }
}

export function setCachedNews(news: NewsItem[]): void {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ news, fetchedAt: Date.now() }));
    } catch {
        // localStorage unavailable, skip
    }
}

export function clearNewsCache(): void {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch {
        // ignore
    }
}
