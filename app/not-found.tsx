import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Nahi Mila | WebDev Times",
  description: "Yeh page exist nahi karta. Wapas WebDev Times par jao.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#06060f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "white",
      textAlign: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, borderRadius: "50%", background: "rgba(121,40,202,0.1)", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,75,43,0.07)", filter: "blur(80px)", pointerEvents: "none" }} />

      {/* Grid texture */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7928CA, #FF0080)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, boxShadow: "0 4px 20px rgba(121,40,202,0.4)" }}>W</div>
          <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em", fontFamily: "Georgia, serif" }}>WebDev Times</span>
        </div>

        {/* 404 big number */}
        <div style={{
          fontSize: "clamp(80px, 20vw, 140px)",
          fontWeight: 900,
          lineHeight: 1,
          fontFamily: "Georgia, 'Times New Roman', serif",
          background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.04))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 8,
          userSelect: "none",
        }}>404</div>

        {/* Divider */}
        <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.8), transparent)", margin: "0 auto 28px" }} />

        {/* Headline */}
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-0.02em", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
          Yeh Page Nahi Mila 😔
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 36 }}>
          Jis page ko dhundh rahe ho woh exist nahi karta, delete ho gaya,
          ya URL galat hai. Koi baat nahi — wapas chalo!
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 28px", borderRadius: 12, textDecoration: "none",
            background: "linear-gradient(135deg, #7928CA, #FF0080)",
            color: "white", fontSize: 14, fontWeight: 700,
            boxShadow: "0 8px 32px rgba(121,40,202,0.35)",
            transition: "all 0.2s ease",
          }}>
            🏠 Homepage Par Jao
          </Link>

          <Link href="/news" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 28px", borderRadius: 12, textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 600,
          }}>
            📰 News Padho
          </Link>
        </div>

        {/* Footer note */}
        <p style={{ marginTop: 48, fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          WebDev Times · Error 404
        </p>
      </div>
    </div>
  );
}