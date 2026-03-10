export type NewsCategory = "AI Models" | "Dev Tools" | "Frontend" | "Backend" | "Design" | "Strategy";
export type NewsTag = "BREAKING" | "HOT" | "TRENDING" | "NEW" | "INSIGHT" | "TOOLS";

export interface NewsItem {
    id: number;
    category: NewsCategory;
    tag: NewsTag;
    headline: string;
    subheadline: string;
    summary: string;
    detail: string;
    emoji: string;
    readTime: string;
    accentColor: string;
}
