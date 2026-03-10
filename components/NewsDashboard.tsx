"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NewsItem } from "@/types/news";
import { fetchWebDevNews } from "@/lib/newsClient";
import NewsCard from "./NewsCard";
import NewsModal from "./NewsModal";
import { NewsGridSkeleton } from "./LoadingSkeletons";

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "AI Models", "Dev Tools", "Frontend", "Backend", "Design", "Strategy"];

const categoryAccent: Record<string, { color: string; bg: string }> = {
    "All": { color: "#A855F7", bg: "rgba(168,85,247,0.09)" },
    "AI Models": { color: "#FF4B2B", bg: "rgba(255,75,43,0.08)" },
    "Dev Tools": { color: "#A855F7", bg: "rgba(168,85,247,0.08)" },
    "Frontend": { color: "#3B82F6", bg: "rgba(59,130,246,0.08)" },
    "Backend": { color: "#10B981", bg: "rgba(16,185,129,0.08)" },
    "Design": { color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
    "Strategy": { color: "#EC4899", bg: "rgba(236,72,153,0.08)" },
};

// ── CSS injected once ─────────────────────────────────────────────────────────

const globalCss = `
    @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.55;transform:scale(0.82)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .news-card-grid > * { animation: cardIn 0.45s ease both; }
    .news-card-grid > *:nth-child(1){ animation-delay:0.04s }
    .news-card-grid > *:nth-child(2){ animation-delay:0.08s }
    .news-card-grid > *:nth-child(3){ animation-delay:0.12s }
    .news-card-grid > *:nth-child(4){ animation-delay:0.16s }
    .news-card-grid > *:nth-child(5){ animation-delay:0.20s }
    .news-card-grid > *:nth-child(6){ animation-delay:0.24s }
    .news-card-grid > *:nth-child(7){ animation-delay:0.28s }
    .news-card-grid > *:nth-child(8){ animation-delay:0.32s }
    .news-card-grid > *:nth-child(9){ animation-delay:0.36s }
    .news-card-grid > *:nth-child(10){ animation-delay:0.40s }
`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function NewsDashboard() {
    const queryClient = useQueryClient();

    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
    const [extraPages, setExtraPages] = useState<NewsItem[][]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [moreError, setMoreError] = useState<string | null>(null);
    const [catHover, setCatHover] = useState<string | null>(null);
    const [refreshHover, setRefreshHover] = useState(false);
    const [loadMoreHover, setLoadMoreHover] = useState(false);

    // Primary query — reads from prefetch cache if Hero page already fetched
    const { data: firstPage, isLoading, isError, error, refetch } = useQuery<NewsItem[]>({
        queryKey: ["news", 0],
        queryFn: () => fetchWebDevNews(0),
        staleTime: 30 * 60 * 1000,
    });

    const allNews: NewsItem[] = [firstPage ?? [], ...extraPages].flat();

    const filtered = activeCategory === "All"
        ? allNews
        : allNews.filter(n => n.category === activeCategory);

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["news"] });
        setExtraPages([]);
    };

    const loadMore = async () => {
        setLoadingMore(true);
        setMoreError(null);
        try {
            const skip = allNews.length;
            const cacheKey = ["news", skip];
            const cached = queryClient.getQueryData<NewsItem[]>(cacheKey);
            const page = cached ?? await fetchWebDevNews(skip);
            if (!cached) queryClient.setQueryData(cacheKey, page);
            setExtraPages(prev => [...prev, page]);
        } catch (err) {
            setMoreError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#06060f", color: "white", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
            <style>{globalCss}</style>

            {/* ── Ambient Background ── */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
                <div style={{ position: "absolute", top: "-15%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, borderRadius: "50%", background: "rgba(100,40,180,0.09)", filter: "blur(120px)" }} />
                <div style={{ position: "absolute", bottom: 0, right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(59,130,246,0.06)", filter: "blur(100px)" }} />
                <div style={{ position: "absolute", inset: 0, opacity: 0.022, backgroundImage: "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
            </div>

            {/* ── NAVBAR ── */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 40,
                background: "rgba(6,6,15,0.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 62, flexWrap: "wrap", rowGap: 10 }}>
                        {/* Logo */}
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7928CA,#FF0080)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "white", boxShadow: "0 4px 16px rgba(121,40,202,0.45)", flexShrink: 0 }}>W</div>
                            <div>
                                <div style={{ fontSize: 17, fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>WebDev Times</div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 2 }}>Powered by Groq AI</div>
                            </div>
                            {/* Live badge */}
                            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)", marginLeft: 4 }}>
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#EF4444", animation: "pulse-dot 1.4s ease-in-out infinite" }} />
                                <span style={{ fontSize: 9, fontWeight: 800, color: "#F87171", letterSpacing: "0.18em", textTransform: "uppercase" }}>Live</span>
                            </div>
                        </div>

                        {/* Date + Refresh */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.02em", display: "none" }} className="sm-show">{today}</span>
                            <button
                                onClick={handleRefresh}
                                onMouseEnter={() => setRefreshHover(true)}
                                onMouseLeave={() => setRefreshHover(false)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "8px 14px", borderRadius: 10,
                                    border: `1px solid ${refreshHover ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
                                    background: refreshHover ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                                    color: refreshHover ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)",
                                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <span style={{ display: "inline-block", animation: isLoading ? "spin 0.8s linear infinite" : "none", fontSize: 13 }}>↻</span>
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Category pills */}
                    <div className="scrollbar-hide" style={{ paddingBottom: 12, overflowX: "auto", display: "flex", gap: 6, scrollbarWidth: "none" }}>
                        {CATEGORIES.map(cat => {
                            const isActive = activeCategory === cat;
                            const ac = categoryAccent[cat] ?? categoryAccent["All"];
                            const isH = catHover === cat;
                            return (
                                <button key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    onMouseEnter={() => setCatHover(cat)}
                                    onMouseLeave={() => setCatHover(null)}
                                    style={{
                                        flexShrink: 0, padding: "7px 16px", borderRadius: 999,
                                        border: `1px solid ${isActive ? ac.color + "45" : isH ? ac.color + "25" : "rgba(255,255,255,0.08)"}`,
                                        background: isActive ? ac.bg : isH ? `${ac.color}08` : "transparent",
                                        color: isActive ? ac.color : isH ? `${ac.color}bb` : "rgba(255,255,255,0.32)",
                                        fontSize: 12, fontWeight: isActive ? 700 : 500, cursor: "pointer",
                                        transition: "all 0.2s ease", whiteSpace: "nowrap",
                                        boxShadow: isActive ? `0 2px 12px ${ac.color}20` : "none",
                                    }}>
                                    {cat}
                                    {isActive && cat !== "All" && (
                                        <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.6 }}>
                                            {allNews.filter(n => n.category === cat).length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* ── MAIN ── */}
            <main style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px" }}>

                {/* Section header */}
                {!isLoading && !isError && (
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                <div style={{ height: 1, width: 32, background: "rgba(255,255,255,0.15)" }} />
                                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700 }}>Today&apos;s Edition</span>
                            </div>
                            <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-0.03em", fontFamily: "'DM Sans','Segoe UI',sans-serif", lineHeight: 1 }}>
                                {activeCategory === "All" ? "Aaj Ki Top Khabrein" : activeCategory}
                            </h1>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", marginTop: 6 }}>
                                {filtered.length} stories · Groq AI se fresh fetch
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {[{ label: "Stories", val: allNews.length }, { label: "Categories", val: 6 }].map(s => (
                                <div key={s.label} style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                                    <div style={{ fontSize: 18, fontWeight: 900, color: "white", lineHeight: 1 }}>{s.val}</div>
                                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── States ── */}
                {isLoading ? (
                    <NewsGridSkeleton />
                ) : isError ? (
                    <div style={{ textAlign: "center", padding: "80px 20px" }}>
                        <div style={{ fontSize: 52, marginBottom: 16 }}>😔</div>
                        <p style={{ color: "#F87171", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Aaj news fetch nahi hui</p>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 20, maxWidth: 360, margin: "0 auto 20px" }}>
                            {error instanceof Error ? error.message : "API key check karo ya thodi der baad try karo"}
                        </p>
                        <button onClick={() => refetch()} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#F87171", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                            Dobara Try Karo
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 20px" }}>
                        <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
                        <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 15, marginBottom: 16 }}>Is category mein koi khabar nahi</p>
                        <button onClick={() => setActiveCategory("All")} style={{ padding: "9px 22px", borderRadius: 10, border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.1)", color: "#C084FC", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                            Sab Dekho
                        </button>
                    </div>
                ) : (
                    <div className="news-card-grid news-grid">
                        {filtered.map(item => (
                            <NewsCard key={`${item.id}-${item.headline}`} item={item} onClick={setSelectedItem} />
                        ))}
                    </div>
                )}

                {/* Load more */}
                {!isLoading && !isError && filtered.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 44, gap: 10 }}>
                        {moreError && (
                            <p style={{ color: "#F87171", fontSize: 12, margin: 0 }}>{moreError}</p>
                        )}
                        <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            onMouseEnter={() => setLoadMoreHover(true)}
                            onMouseLeave={() => setLoadMoreHover(false)}
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "14px 36px", borderRadius: 999,
                                border: `1px solid ${loadMoreHover ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.09)"}`,
                                background: loadMoreHover ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                                color: loadMoreHover ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                                fontSize: 13, fontWeight: 700, cursor: loadingMore ? "not-allowed" : "pointer",
                                transform: loadMoreHover && !loadingMore ? "translateY(-2px)" : "translateY(0)",
                                boxShadow: loadMoreHover && !loadingMore ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
                                transition: "all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                                opacity: loadingMore ? 0.5 : 1,
                            }}
                        >
                            {loadingMore ? (
                                <>
                                    <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                                    Aa Rahi Hain...
                                </>
                            ) : (
                                <>
                                    Aur Khabrein Load Karo
                                    <span style={{ transform: loadMoreHover ? "translateY(2px)" : "translateY(0)", display: "inline-block", transition: "transform 0.25s" }}>↓</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </main>

            {/* Modal */}
            <NewsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
    );
}
