"use client";
import { useState } from "react";
import { NewsItem } from "@/types/news";

interface NewsCardProps {
    item: NewsItem;
    onClick: (item: NewsItem) => void;
}

const categoryAccent: Record<string, { color: string; glow: string; bg: string }> = {
    "AI Models": { color: "#FF4B2B", glow: "rgba(255,75,43,0.25)", bg: "rgba(255,75,43,0.08)" },
    "Dev Tools": { color: "#A855F7", glow: "rgba(168,85,247,0.25)", bg: "rgba(168,85,247,0.08)" },
    "Frontend": { color: "#3B82F6", glow: "rgba(59,130,246,0.25)", bg: "rgba(59,130,246,0.08)" },
    "Backend": { color: "#10B981", glow: "rgba(16,185,129,0.25)", bg: "rgba(16,185,129,0.08)" },
    "Design": { color: "#F59E0B", glow: "rgba(245,158,11,0.25)", bg: "rgba(245,158,11,0.08)" },
    "Strategy": { color: "#EC4899", glow: "rgba(236,72,153,0.25)", bg: "rgba(236,72,153,0.08)" },
};

const tagConfig: Record<string, { color: string; bg: string; border: string }> = {
    BREAKING: { color: "#F87171", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
    HOT: { color: "#FB923C", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)" },
    TRENDING: { color: "#C084FC", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.3)" },
    NEW: { color: "#60A5FA", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
    INSIGHT: { color: "#22D3EE", bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.3)" },
    TOOLS: { color: "#34D399", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
};

export default function NewsCard({ item, onClick }: NewsCardProps) {
    const [hovered, setHovered] = useState(false);
    const ac = categoryAccent[item.category] ?? categoryAccent["AI Models"];
    const tag = tagConfig[item.tag] ?? tagConfig.NEW;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onClick(item)}
            style={{
                background: hovered
                    ? "linear-gradient(145deg, #13131f, #0f0f1c)"
                    : "linear-gradient(145deg, #0f0f1c, #0c0c18)",
                border: `1px solid ${hovered ? ac.color + "35" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 18,
                padding: "22px 24px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                boxShadow: hovered
                    ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${ac.color}20, inset 0 1px 0 rgba(255,255,255,0.05)`
                    : "0 4px 20px rgba(0,0,0,0.3)",
                transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
            }}
        >
            {/* Top color stripe */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${ac.color}00, ${ac.color}, ${ac.color}60, ${ac.color}00)`,
                opacity: hovered ? 1 : 0.5,
                transition: "opacity 0.3s",
            }} />

            {/* Corner glow */}
            <div style={{
                position: "absolute", top: -30, right: -30, width: 120, height: 120,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${ac.color}${hovered ? "18" : "0a"} 0%, transparent 70%)`,
                transition: "all 0.3s",
                pointerEvents: "none",
            }} />

            {/* Tags row */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
                <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", borderRadius: 999,
                    background: tag.bg, border: `1px solid ${tag.border}`,
                    fontSize: 9, fontWeight: 900, color: tag.color,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: tag.color, display: "inline-block" }} />
                    {item.tag}
                </span>
                <span style={{
                    padding: "4px 10px", borderRadius: 999,
                    background: ac.bg, border: `1px solid ${ac.color}25`,
                    fontSize: 9, fontWeight: 700, color: ac.color,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                }}>{item.category}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 4 }}>
                    ⏱ {item.readTime}
                </span>
            </div>

            {/* Headline */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{
                    flexShrink: 0, width: 44, height: 44, borderRadius: 12,
                    background: `${ac.color}12`, border: `1px solid ${ac.color}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                    transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1) rotate(0deg)",
                    transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: 16, fontWeight: 800, color: "white", lineHeight: 1.3,
                        letterSpacing: "-0.02em", marginBottom: 4,
                        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                    }}>{item.headline}</h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.4, fontStyle: "italic" }}>{item.subheadline}</p>
                </div>
            </div>

            {/* Summary preview (2-line clamp) */}
            <p style={{
                fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                overflow: "hidden",
                borderLeft: `2px solid ${ac.color}30`, paddingLeft: 10,
                marginBottom: 16,
            }}>{item.summary}</p>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                    fontSize: 11, color: ac.color, fontWeight: 700, letterSpacing: "0.04em",
                    opacity: hovered ? 1 : 0.6, transition: "opacity 0.2s",
                    display: "flex", alignItems: "center", gap: 5,
                }}>
                    Poora Padho
                    <span style={{
                        transform: hovered ? "translateX(3px)" : "translateX(0)",
                        transition: "transform 0.25s ease", display: "inline-block",
                    }}>→</span>
                </span>
                <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: `${ac.color}15`, border: `1px solid ${ac.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                    transform: hovered ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.25s ease",
                }}>↗</div>
            </div>
        </div>
    );
}
