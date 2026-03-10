"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { fetchWebDevNews } from "@/lib/newsClient";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const CATEGORIES = ["AI Models", "Dev Tools", "Frontend", "Backend", "Design"];

const categoryColors = {
    "AI Models": { primary: "#FF4B2B", glow: "rgba(255,75,43,0.3)", bg: "rgba(255,75,43,0.08)" },
    "Dev Tools": { primary: "#A855F7", glow: "rgba(168,85,247,0.3)", bg: "rgba(168,85,247,0.08)" },
    "Frontend": { primary: "#3B82F6", glow: "rgba(59,130,246,0.3)", bg: "rgba(59,130,246,0.08)" },
    "Backend": { primary: "#10B981", glow: "rgba(16,185,129,0.3)", bg: "rgba(16,185,129,0.08)" },
    "Design": { primary: "#F59E0B", glow: "rgba(245,158,11,0.3)", bg: "rgba(245,158,11,0.08)" },
};

const TICKER_ITEMS = [
    "🔥 Llama 3.3 70B — Groq pe Live",
    "⚡ Next.js 16 now stable",
    "🚀 Cursor crosses 1M users",
    "🧠 DeepSeek V3 open-sourced",
    "🎨 Figma AI launches Agent mode",
    "🛠 Vite 7 ships with Rolldown",
    "🤖 GPT-5 enters limited beta",
    "💡 Claude Sonnet 5 tops SWE-Bench",
];

const features = [
    {
        icon: "⚡",
        title: "Real-time AI News",
        desc: "Groq se seedha fetch — har din fresh khabrein, koi manual update nahi",
        color: categoryColors["AI Models"],
        stat: "Live",
        statLabel: "Updates",
    },
    {
        icon: "🇮🇳",
        title: "Hinglish Style",
        desc: "Indian devs ke liye, unki hi bhasha mein — Hindi-English mix news",
        color: categoryColors["Dev Tools"],
        stat: "10+",
        statLabel: "Stories Daily",
    },
    {
        icon: "🗓",
        title: "Smart Caching",
        desc: "30-minute smart cache — same data, zero extra API calls, full speed",
        color: categoryColors["Frontend"],
        stat: "30m",
        statLabel: "Cache TTL",
    },
];

// Animated floating orbs background
const Orbs = () => (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {[
            { w: 900, h: 700, top: "-20%", left: "50%", tx: "-50%", color: "rgba(120,40,200,0.12)", blur: 140 },
            { w: 600, h: 600, top: "30%", left: "-10%", tx: "0", color: "rgba(59,130,246,0.1)", blur: 120 },
            { w: 500, h: 500, bottom: "0", right: "-5%", color: "rgba(255,75,43,0.08)", blur: 100 },
        ].map((o, i) => (
            <div key={i} style={{
                position: "absolute", width: o.w, height: o.h,
                top: o.top, left: o.left, bottom: o.bottom, right: o.right,
                transform: o.tx ? `translateX(${o.tx})` : undefined,
                borderRadius: "50%", background: o.color,
                filter: `blur(${o.blur}px)`,
                animation: `float${i} ${8 + i * 2}s ease-in-out infinite alternate`,
            }} />
        ))}
        {/* Grid */}
        <div style={{
            position: "absolute", inset: 0, opacity: 0.025,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
        }} />
        <style>{`
      @keyframes float0{from{transform:translateX(-50%) translateY(0) scale(1)}to{transform:translateX(-50%) translateY(-30px) scale(1.05)}}
      @keyframes float1{from{transform:translateY(0) scale(1)}to{transform:translateY(-20px) scale(1.03)}}
      @keyframes float2{from{transform:translateY(0)}to{transform:translateY(-25px)}}
      @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes pulse-ring{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:0.7}}
      @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
      @keyframes pwaFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes installPulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)}70%{box-shadow:0 0 0 10px rgba(99,102,241,0)}}
    `}</style>
    </div>
);

// Ticker
const Ticker = () => {
    const text = [...TICKER_ITEMS, ...TICKER_ITEMS].join("   ——   ");
    return (
        <div style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.015)",
            overflow: "hidden", display: "flex", alignItems: "stretch",
        }}>
            <div style={{
                flexShrink: 0, background: "#DC2626",
                padding: "0 16px", display: "flex", alignItems: "center",
                fontSize: 10, fontWeight: 900, letterSpacing: "0.2em",
                color: "white", textTransform: "uppercase", zIndex: 2,
                boxShadow: "4px 0 20px rgba(220,38,38,0.5)",
            }}>LIVE</div>
            <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{
                    display: "inline-block", whiteSpace: "nowrap",
                    animation: "ticker 35s linear infinite",
                    padding: "8px 24px",
                    color: "rgba(255,255,255,0.45)", fontSize: 11, letterSpacing: "0.04em",
                }}>
                    {text + "   ——   " + text}
                </div>
            </div>
        </div>
    );
};

// Status badge
type StatusKey = "idle" | "fetching" | "ready" | "error";
const StatusBadge = ({ status }: { status: StatusKey }) => {
    const map: Record<StatusKey, { color: string; label: string; pulse?: boolean }> = {
        idle: { color: "#F59E0B", label: "Initializing…" },
        fetching: { color: "#EF4444", label: "Fetching News…", pulse: true },
        ready: { color: "#10B981", label: "News Ready" },
        error: { color: "#F97316", label: "Retry on News Page" },
    };
    const s = map[status];
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 999,
            border: `1px solid ${s.color}30`,
            background: `${s.color}10`,
            fontSize: 11, fontWeight: 700, color: s.color,
            letterSpacing: "0.04em",
        }}>
            <div style={{ position: "relative", width: 7, height: 7 }}>
                <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: s.color,
                    animation: s.pulse ? "pulse-ring 1.2s ease-in-out infinite" : "none",
                }} />
                {s.pulse && <div style={{
                    position: "absolute", inset: -3, borderRadius: "50%",
                    border: `1.5px solid ${s.color}`,
                    animation: "pulse-ring 1.2s ease-in-out infinite",
                    opacity: 0.5,
                }} />}
            </div>
            <span>{s.label}</span>
        </div>
    );
};

export default function HeroPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<"idle" | "fetching" | "ready" | "error">("fetching");
    const [hovered, setHovered] = useState<number | null>(null);
    const [btnHover, setBtnHover] = useState(false);
    const [catHover, setCatHover] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [installHover, setInstallHover] = useState(false);
    const { isInstallable, isInstalled, install } = usePWAInstall();

    useEffect(() => {
        setMounted(true);
        // Real background prefetch via TanStack Query
        const run = async () => {
            const cached = queryClient.getQueryData<unknown[]>(["news", 0]);
            if (cached?.length) { setStatus("ready"); return; }
            try {
                await queryClient.prefetchQuery({ queryKey: ["news", 0], queryFn: () => fetchWebDevNews(0), staleTime: 30 * 60 * 1000 });
                setStatus("ready");
            } catch { setStatus("error"); }
        };
        run();
    }, [queryClient]);

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    return (
        <div style={{
            minHeight: "100vh", background: "#06060f", color: "white",
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            display: "flex", flexDirection: "column", position: "relative",
            overflowX: "hidden",
        }}>
            <Orbs />

            {/* ── NAVBAR ── */}
            <header style={{
                position: "relative", zIndex: 20,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(6,6,15,0.85)",
                backdropFilter: "blur(20px)",
                animation: mounted ? "fadeIn 0.5s ease both" : "none",
            }}>
                <div style={{
                    maxWidth: 1280, margin: "0 auto",
                    padding: "0 24px", minHeight: 64,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", rowGap: 12,
                }}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: "linear-gradient(135deg, #7928CA, #FF0080)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, fontWeight: 900, color: "white",
                            boxShadow: "0 4px 20px rgba(121,40,202,0.5)",
                        }}>W</div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: "white", letterSpacing: "-0.02em", lineHeight: 1 }}>
                                WebDev Times
                            </div>
                            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>
                                Powered by Groq AI
                            </div>
                        </div>
                    </div>

                    {/* Center — date */}
                    <div
                        className="show-md"
                        style={{
                            alignItems: "center",
                            gap: 6,
                            fontSize: 11,
                            color: "rgba(255,255,255,0.3)",
                            letterSpacing: "0.05em",
                        }}
                    >
                        <span>📅</span>
                        <span style={{ display: "none" }}>{today}</span>
                        <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    {/* Status */}
                    <StatusBadge status={status} />
                </div>
            </header>

            {/* ── TICKER ── */}
            <div style={{ position: "relative", zIndex: 10, animation: mounted ? "fadeIn 0.6s 0.2s ease both" : "none", opacity: 0 }}>
                <Ticker />
            </div>

            {/* ── HERO ── */}
            <main style={{
                position: "relative", zIndex: 10, flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "64px 24px 40px",
                textAlign: "center",
            }}>

                {/* Edition pill */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "8px 20px", borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase", marginBottom: 40,
                    animation: mounted ? "fadeUp 0.6s 0.1s ease both" : "none", opacity: 0,
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                    {today} · Daily Edition
                </div>

                {/* Masthead */}
                <div style={{ marginBottom: 28, animation: mounted ? "fadeUp 0.7s 0.2s ease both" : "none", opacity: 0 }}>
                    {/* Thin rule */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, justifyContent: "center" }}>
                        <div style={{ height: 1, width: 80, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2))" }} />
                        <span style={{ fontSize: 10, letterSpacing: "0.35em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Est. 2026</span>
                        <div style={{ height: 1, width: 80, background: "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)" }} />
                    </div>

                    <h1 style={{
                        fontSize: "clamp(56px, 13vw, 128px)",
                        fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em",
                        margin: 0,
                        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                    }}>
                        <span style={{ display: "block", color: "white" }}>WebDev</span>
                        <span style={{
                            display: "block",
                            background: "linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #F97316 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            filter: "drop-shadow(0 0 60px rgba(168,85,247,0.4))",
                        }}>Times</span>
                    </h1>

                    {/* Decorative rule under title */}
                    <div style={{
                        margin: "20px auto 0", height: 2, maxWidth: 520,
                        background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(236,72,153,0.6), transparent)",
                        borderRadius: 999,
                    }} />
                </div>

                {/* Tagline */}
                <p style={{
                    fontSize: "clamp(14px, 2vw, 18px)", maxWidth: 520, lineHeight: 1.7,
                    color: "rgba(255,255,255,0.45)", marginBottom: 8,
                    animation: mounted ? "fadeUp 0.7s 0.35s ease both" : "none", opacity: 0,
                }}>
                    Web Development aur AI ki duniya ki{" "}
                    <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>taza khabar</span>
                    {" "}— har din, har update
                </p>
                <p style={{
                    fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)", marginBottom: 48,
                    animation: mounted ? "fadeUp 0.7s 0.4s ease both" : "none", opacity: 0,
                }}>
                    Powered by Groq AI
                </p>

                {/* CTA Button */}
                <div style={{ animation: mounted ? "fadeUp 0.7s 0.5s ease both" : "none", opacity: 0, marginBottom: 52 }}>
                    <button
                        onClick={() => router.push("/news")}
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        style={{
                            position: "relative", overflow: "hidden",
                            display: "inline-flex", alignItems: "center", gap: 14,
                            padding: "18px 44px", borderRadius: 16, border: "none",
                            cursor: "pointer", fontSize: 16, fontWeight: 800, color: "white",
                            background: btnHover
                                ? "linear-gradient(135deg, #8B5CF6, #EC4899, #F97316)"
                                : "linear-gradient(135deg, #7928CA, #FF0080)",
                            transform: btnHover ? "scale(1.04) translateY(-2px)" : "scale(1) translateY(0)",
                            boxShadow: btnHover
                                ? "0 24px 80px rgba(168,85,247,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
                                : "0 12px 50px rgba(121,40,202,0.4)",
                            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {/* Shine sweep */}
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)",
                            transform: btnHover ? "translateX(100%)" : "translateX(-100%)",
                            transition: "transform 0.5s ease",
                        }} />
                        {/* <span>📰</span> */}
                        <span onClick={() => router.push("/news")}>Read Today&apos;s News</span>
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 28, height: 28, borderRadius: 8,
                            background: "rgba(255,255,255,0.15)",
                            transform: btnHover ? "translateX(4px)" : "translateX(0)",
                            transition: "transform 0.3s ease",
                            fontSize: 14,
                        }}>→</div>
                    </button>

                    {/* Sub-hint */}
                    <div style={{ marginTop: 14, fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
                        {status === "ready" ? "✦ News pre-loaded — instant access" : "✦ Loading news in background…"}
                    </div>

                    {/* PWA Install Button */}
                    {!isInstalled && isInstallable && (
                        <div style={{ marginTop: 20, animation: "pwaFadeIn 0.5s 0.1s ease both", opacity: 0 }}>
                            <button
                                onClick={install}
                                onMouseEnter={() => setInstallHover(true)}
                                onMouseLeave={() => setInstallHover(false)}
                                style={{
                                    position: "relative", overflow: "hidden",
                                    display: "inline-flex", alignItems: "center", gap: 10,
                                    padding: "13px 32px", borderRadius: 14,
                                    border: installHover
                                        ? "1px solid rgba(99,102,241,0.7)"
                                        : "1px solid rgba(99,102,241,0.3)",
                                    background: installHover
                                        ? "rgba(99,102,241,0.18)"
                                        : "rgba(99,102,241,0.08)",
                                    color: installHover ? "#a5b4fc" : "rgba(165,180,252,0.75)",
                                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                                    backdropFilter: "blur(12px)",
                                    WebkitBackdropFilter: "blur(12px)",
                                    transform: installHover ? "translateY(-2px) scale(1.03)" : "translateY(0) scale(1)",
                                    boxShadow: installHover
                                        ? "0 12px 40px rgba(99,102,241,0.3), 0 0 0 1px rgba(99,102,241,0.2)"
                                        : "0 4px 20px rgba(99,102,241,0.1)",
                                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                    letterSpacing: "-0.01em",
                                    animation: "installPulse 2.5s ease-in-out 1s 3",
                                }}
                            >
                                {/* Shine */}
                                <div style={{
                                    position: "absolute", inset: 0,
                                    background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
                                    transform: installHover ? "translateX(100%)" : "translateX(-100%)",
                                    transition: "transform 0.5s ease",
                                }} />
                                {/* Download icon */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>Install App</span>
                                {/* PWA badge */}
                                <div style={{
                                    padding: "2px 8px", borderRadius: 999,
                                    background: "rgba(99,102,241,0.25)",
                                    border: "1px solid rgba(99,102,241,0.4)",
                                    fontSize: 9, fontWeight: 900, letterSpacing: "0.15em",
                                    color: "#818cf8", textTransform: "uppercase",
                                }}>PWA</div>
                            </button>
                            <div style={{ marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}>
                                Works offline · No app store needed
                            </div>
                        </div>
                    )}

                    {/* Already installed state */}
                    {isInstalled && (
                        <div style={{
                            marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "8px 18px", borderRadius: 999,
                            border: "1px solid rgba(16,185,129,0.3)",
                            background: "rgba(16,185,129,0.08)",
                            fontSize: 12, fontWeight: 700, color: "#34d399",
                            animation: "pwaFadeIn 0.5s ease both",
                        }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            App Installed
                        </div>
                    )}
                </div>

                {/* Category pills */}
                <div style={{
                    display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10,
                    animation: mounted ? "fadeUp 0.7s 0.65s ease both" : "none", opacity: 0,
                }}>
                    {CATEGORIES.map((cat) => {
                        const c = categoryColors[cat as keyof typeof categoryColors];
                        const isH = catHover === cat;
                        return (
                            <button
                                key={cat}
                                onMouseEnter={() => setCatHover(cat)}
                                onMouseLeave={() => setCatHover(null)}
                                style={{
                                    padding: "9px 20px", borderRadius: 999, cursor: "pointer",
                                    border: `1px solid ${isH ? c.primary + "80" : c.primary + "25"}`,
                                    background: isH ? c.bg + "cc" : c.bg,
                                    color: isH ? c.primary : c.primary + "cc",
                                    fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
                                    transform: isH ? "translateY(-2px) scale(1.05)" : "translateY(0) scale(1)",
                                    boxShadow: isH ? `0 8px 24px ${c.glow}` : "none",
                                    transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </main>

            {/* ── FEATURES ── */}
            <section style={{
                position: "relative", zIndex: 10,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "0 24px 0",
                animation: mounted ? "fadeUp 0.8s 0.75s ease both" : "none", opacity: 0,
            }}>
                <div
                    className="feature-grid"
                    style={{
                        maxWidth: 1100,
                        margin: "0 auto",
                    }}
                >
                    {features.map((f, i) => {
                        const isH = hovered === i;
                        return (
                            <div
                                key={f.title}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    padding: "36px 32px", cursor: "default",
                                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                                    background: isH ? `${f.color.primary}08` : "transparent",
                                    transition: "background 0.3s ease",
                                    position: "relative", overflow: "hidden",
                                }}
                            >
                                {/* Glow top accent */}
                                {isH && (
                                    <div style={{
                                        position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                                        background: `linear-gradient(90deg, transparent, ${f.color.primary}, transparent)`,
                                    }} />
                                )}

                                <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                                    {/* Icon */}
                                    <div style={{
                                        flexShrink: 0, width: 52, height: 52, borderRadius: 14,
                                        background: `${f.color.primary}15`,
                                        border: `1px solid ${f.color.primary}25`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 22,
                                        boxShadow: isH ? `0 8px 32px ${f.color.glow}` : "none",
                                        transform: isH ? "scale(1.08)" : "scale(1)",
                                        transition: "all 0.3s ease",
                                    }}>
                                        {f.icon}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        {/* Stat */}
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                                            <span style={{ fontSize: 22, fontWeight: 900, color: f.color.primary, lineHeight: 1 }}>{f.stat}</span>
                                            <span style={{ fontSize: 10, color: f.color.primary + "80", textTransform: "uppercase", letterSpacing: "0.1em" }}>{f.statLabel}</span>
                                        </div>
                                        <h3 style={{
                                            margin: "0 0 8px", fontSize: 15, fontWeight: 800,
                                            color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em",
                                            fontFamily: "'Georgia', serif",
                                        }}>{f.title}</h3>
                                        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}>{f.desc}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{
                position: "relative", zIndex: 10,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 12,
            }}>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    WebDev Times © {new Date().getFullYear()} · AI-generated news for developers
                </p>
                <div style={{ display: "flex", gap: 20 }}>
                    {["About", "Privacy", "API Docs"].map(link => (
                        <span key={link} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", cursor: "pointer", letterSpacing: "0.06em" }}>
                            {link}
                        </span>
                    ))}
                </div>
            </footer>
        </div>
    );
}