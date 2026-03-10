"use client";
import { useState, useEffect } from "react";
import { NewsItem } from "@/types/news";

interface NewsModalProps {
    item: NewsItem | null;
    onClose: () => void;
}

const tagConfig: Record<string, { bg: string; color: string; border: string; glow: string }> = {
    BREAKING: { bg: "rgba(239,68,68,0.12)", color: "#F87171", border: "rgba(239,68,68,0.3)", glow: "rgba(239,68,68,0.4)" },
    HOT: { bg: "rgba(249,115,22,0.12)", color: "#FB923C", border: "rgba(249,115,22,0.3)", glow: "rgba(249,115,22,0.4)" },
    TRENDING: { bg: "rgba(168,85,247,0.12)", color: "#C084FC", border: "rgba(168,85,247,0.3)", glow: "rgba(168,85,247,0.4)" },
    NEW: { bg: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "rgba(59,130,246,0.3)", glow: "rgba(59,130,246,0.4)" },
    INSIGHT: { bg: "rgba(6,182,212,0.12)", color: "#22D3EE", border: "rgba(6,182,212,0.3)", glow: "rgba(6,182,212,0.4)" },
    TOOLS: { bg: "rgba(16,185,129,0.12)", color: "#34D399", border: "rgba(16,185,129,0.3)", glow: "rgba(16,185,129,0.4)" },
};

export default function NewsModal({ item, onClose }: NewsModalProps) {
    const [visible, setVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        if (item) {
            document.body.style.overflow = "hidden";
            requestAnimationFrame(() => {
                setVisible(true);
                setTimeout(() => setContentVisible(true), 120);
            });
        } else {
            document.body.style.overflow = "";
            setVisible(false);
            setContentVisible(false);
        }
        return () => { document.body.style.overflow = ""; };
    }, [item]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClose = () => {
        setContentVisible(false);
        setVisible(false);
        setTimeout(onClose, 320);
    };

    if (!item) return null;

    const tag = tagConfig[item.tag] ?? tagConfig.NEW;
    const accent = item.accentColor;

    return (
        <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
            <style>{`
                @keyframes backdropIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes backdropOut { from { opacity: 1 } to { opacity: 0 } }
                @keyframes slideUp     { from { opacity: 0; transform: translateY(6vh) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
                @keyframes slideDown   { from { opacity: 1; transform: translateY(0) scale(1) }      to { opacity: 0; transform: translateY(6vh) scale(0.96) } }
                @keyframes fadeUp      { from { opacity: 0; transform: translateY(1.2vh) } to { opacity: 1; transform: translateY(0) } }
                @keyframes orbPulse   { 0%,100% { opacity: 0.5 } 50% { opacity: 0.9 } }
                @keyframes scanline   { 0% { transform: translateX(-100%) } 100% { transform: translateX(400%) } }
                @keyframes closePop   { 0% { transform: scale(1) } 50% { transform: scale(0.88) } 100% { transform: scale(1) } }

                /* Staggered content fade */
                .modal-content > * { animation: fadeUp 0.4s ease both; }
                .modal-content > *:nth-child(1) { animation-delay: 0.05s }
                .modal-content > *:nth-child(2) { animation-delay: 0.12s }
                .modal-content > *:nth-child(3) { animation-delay: 0.19s }
                .modal-content > *:nth-child(4) { animation-delay: 0.26s }
                .modal-content > *:nth-child(5) { animation-delay: 0.33s }
                .modal-content > *:nth-child(6) { animation-delay: 0.40s }
                .modal-content > *:nth-child(7) { animation-delay: 0.47s }

                /* Hide native scrollbar but keep scroll */
                .news-modal-card::-webkit-scrollbar { display: none; }
                .news-modal-card { -ms-overflow-style: none; scrollbar-width: none; }

                /* Close button */
                .news-modal-close {
                    width: 2.4rem; height: 2.4rem; border-radius: 50%;
                    border: 1.5px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.06);
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: rgba(255,255,255,0.6);
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                    padding: 0;
                }
                .news-modal-close:hover {
                    background: rgba(255,80,80,0.2);
                    border-color: rgba(255,80,80,0.5);
                    color: #ff6b6b;
                    transform: scale(1.1);
                }
                .news-modal-close:active { animation: closePop 0.2s ease; }

                /* Header row */
                .modal-header-row {
                    display: flex; align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1.25rem;
                }
                .modal-tags-group {
                    display: flex; align-items: center;
                    gap: 0.4rem;
                    flex-wrap: wrap;
                    flex: 1; min-width: 0;
                }

                /* Responsive overrides */
                @media (max-width: 480px) {
                    .news-modal-card         { border-radius: 1.1rem !important; }
                    .news-modal-content-pad  { padding: 4vw 4vw 6vw !important; }
                    .news-modal-subheadline  { padding-left: 0 !important; font-size: 0.75rem !important; }
                    .news-modal-readtime     { display: none !important; }
                    .news-modal-emoji-box    { width: 2.6rem !important; height: 2.6rem !important; font-size: 1.2rem !important; }
                }
            `}</style>

            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 40,
                    background: "rgba(0,0,0,0.80)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    animation: visible ? "backdropIn 0.3s ease both" : "backdropOut 0.3s ease both",
                }}
            />

            {/* Centering wrapper */}
            <div style={{
                position: "fixed", inset: 0, zIndex: 50,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "3vw",
                pointerEvents: "none",
            }}>
                {/* Modal card — scrollable */}
                <div
                    className="news-modal-card"
                    onClick={e => e.stopPropagation()}
                    style={{
                        pointerEvents: "auto",
                        width: "100%", maxWidth: "42rem",
                        /* KEY FIX: maxHeight + overflowY on the card itself, no overflow:hidden */
                        maxHeight: "88vh",
                        overflowY: "auto",
                        overflowX: "hidden",
                        background: "linear-gradient(160deg, #0e0e1a 0%, #090910 100%)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: "1.4rem",
                        boxShadow: `0 2.5rem 7rem rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.05), 0 -0.12rem 5rem ${accent}22`,
                        animation: visible
                            ? "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both"
                            : "slideDown 0.28s ease both",
                        position: "relative",
                        /* Do NOT use overflow:hidden here — it breaks scroll */
                    }}
                >
                    {/* Glow orb (pointer-events:none so it never blocks scroll) */}
                    <div style={{
                        position: "absolute", top: "-5rem", left: "50%", transform: "translateX(-50%)",
                        width: "70%", height: "18rem", borderRadius: "50%",
                        background: `radial-gradient(circle, ${accent}1a 0%, transparent 70%)`,
                        pointerEvents: "none", zIndex: 0,
                        animation: "orbPulse 5s ease-in-out infinite",
                    }} />

                    {/* Top accent bar — scanline plays once */}
                    <div style={{
                        height: "0.18rem", width: "100%",
                        background: `linear-gradient(90deg, ${accent}00, ${accent}, ${accent}80, ${accent}00)`,
                        position: "relative", overflow: "hidden", zIndex: 1, flexShrink: 0,
                    }}>
                        <div style={{
                            position: "absolute", top: 0, width: "40%", height: "100%",
                            background: "rgba(255,255,255,0.55)",
                            animation: "scanline 2s ease-in-out 0.3s 1",
                        }} />
                    </div>

                    {/* Corner decoration */}
                    <div style={{
                        position: "absolute", top: "0.18rem", right: 0, width: "30%", height: "7rem",
                        background: `radial-gradient(circle at top right, ${accent}12 0%, transparent 70%)`,
                        pointerEvents: "none", zIndex: 1,
                    }} />

                    {/* Scrollable content */}
                    <div
                        className={`news-modal-content-pad${contentVisible ? " modal-content" : ""}`}
                        style={{ padding: "1.4rem 1.6rem 1.75rem", position: "relative", zIndex: 2 }}
                    >
                        {/* Row 1: Tags + close */}
                        <div className="modal-header-row">
                            <div className="modal-tags-group">
                                {/* Tag badge */}
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "0.3rem",
                                    padding: "0.3rem 0.7rem", borderRadius: "999px",
                                    background: tag.bg, border: `1px solid ${tag.border}`,
                                    boxShadow: `0 0 0.7rem ${tag.glow}`,
                                    flexShrink: 0,
                                }}>
                                    <div style={{ width: "0.32rem", height: "0.32rem", borderRadius: "50%", background: tag.color, boxShadow: `0 0 0.35rem ${tag.color}` }} />
                                    <span style={{ fontSize: "0.56rem", fontWeight: 900, color: tag.color, letterSpacing: "0.18em", textTransform: "uppercase" }}>{item.tag}</span>
                                </div>

                                {/* Category */}
                                <div style={{
                                    padding: "0.3rem 0.7rem", borderRadius: "999px",
                                    background: `${accent}12`, border: `1px solid ${accent}30`,
                                    fontSize: "0.56rem", fontWeight: 800, color: accent,
                                    letterSpacing: "0.14em", textTransform: "uppercase", flexShrink: 0,
                                }}>
                                    {item.category}
                                </div>

                                {/* Read time */}
                                <div className="news-modal-readtime" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
                                    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {item.readTime}
                                </div>
                            </div>

                            {/* Close button */}
                            <button className="news-modal-close" onClick={handleClose} aria-label="Close">
                                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                    <line x1="1" y1="1" x2="13" y2="13" />
                                    <line x1="13" y1="1" x2="1" y2="13" />
                                </svg>
                            </button>
                        </div>

                        {/* Row 2: Emoji + Headline */}
                        <div style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                            <div
                                className="news-modal-emoji-box"
                                style={{
                                    flexShrink: 0,
                                    width: "3.3rem", height: "3.3rem", borderRadius: "0.85rem",
                                    background: `${accent}18`, border: `1px solid ${accent}28`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.5rem", boxShadow: `0 0.5rem 1.75rem ${accent}22`,
                                }}
                            >
                                {item.emoji}
                            </div>
                            <div style={{ flex: 1, paddingTop: "0.1rem", minWidth: 0 }}>
                                <h1 style={{
                                    margin: 0,
                                    fontSize: "clamp(1rem, 4.5vw, 1.4rem)",
                                    fontWeight: 900, lineHeight: 1.28,
                                    color: "white", letterSpacing: "-0.02em",
                                    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
                                    wordBreak: "break-word",
                                }}>
                                    {item.headline}
                                </h1>
                            </div>
                        </div>

                        {/* Subheadline */}
                        <p
                            className="news-modal-subheadline"
                            style={{
                                margin: "0 0 1.25rem",
                                fontSize: "0.82rem", color: "rgba(255,255,255,0.38)",
                                lineHeight: 1.6, paddingLeft: "4.2rem", fontStyle: "italic",
                            }}
                        >
                            {item.subheadline}
                        </p>

                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.1rem" }}>
                            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                            <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>Story</span>
                            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                        </div>

                        {/* Summary */}
                        <div style={{ marginBottom: "1.1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                                <div style={{ width: "0.18rem", height: "0.9rem", borderRadius: "99px", background: `linear-gradient(180deg, ${accent}, ${accent}40)` }} />
                                <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "rgba(255,255,255,0.28)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Kya Hua</span>
                            </div>
                            <p style={{
                                margin: 0, fontSize: "0.88rem", color: "rgba(255,255,255,0.72)",
                                lineHeight: 1.82, paddingLeft: "0.7rem",
                                borderLeft: "1px solid rgba(255,255,255,0.06)",
                            }}>
                                {item.summary}
                            </p>
                        </div>

                        {/* Developer insight */}
                        <div style={{
                            borderRadius: "0.9rem",
                            border: `1px solid ${accent}28`,
                            background: `linear-gradient(135deg, ${accent}0c 0%, transparent 100%)`,
                            position: "relative", marginBottom: "1.4rem", overflow: "hidden",
                        }}>
                            <div style={{
                                position: "absolute", top: 0, right: 0, width: "5rem", height: "5rem",
                                background: `radial-gradient(circle at top right, ${accent}18, transparent 70%)`,
                                pointerEvents: "none",
                            }} />
                            <div style={{ padding: "1rem 1.1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                                    <div style={{
                                        width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem",
                                        background: `${accent}22`, border: `1px solid ${accent}33`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.8rem", flexShrink: 0,
                                    }}>🛠</div>
                                    <span style={{ fontSize: "0.6rem", fontWeight: 900, color: accent, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                                        Developer Ke Liye
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(255,255,255,0.68)", lineHeight: 1.78 }}>
                                    {item.detail}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ paddingTop: "0.9rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "flex-end" }}>
                            <button
                                onClick={handleClose}
                                style={{
                                    padding: "0.65rem 1.75rem", borderRadius: "0.75rem", border: "none",
                                    background: `linear-gradient(135deg, ${accent}cc, ${accent}88)`,
                                    color: "white", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
                                    boxShadow: `0 0.25rem 1.25rem ${accent}44`,
                                    transition: "all 0.25s ease",
                                    width: "100%", maxWidth: "11rem",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 0.5rem 1.75rem ${accent}55`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0.25rem 1.25rem ${accent}44`; }}
                            >
                                Got it ✓
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
