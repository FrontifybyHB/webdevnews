"use client";

const shimmerStyle = {
    backgroundSize: "200% auto",
    animation: "shimmer 1.8s linear infinite",
    backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%)",
};

function SkeletonCard() {
    return (
        <div style={{
            background: "#0f0f1c", borderRadius: 18, padding: "22px 24px",
            border: "1px solid rgba(255,255,255,0.06)",
        }}>
            {/* Tag row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[60, 80].map(w => (
                    <div key={w} style={{ height: 20, width: w, borderRadius: 99, background: "rgba(255,255,255,0.06)", ...shimmerStyle }} />
                ))}
                <div style={{ marginLeft: "auto", height: 20, width: 40, borderRadius: 99, background: "rgba(255,255,255,0.04)", ...shimmerStyle }} />
            </div>
            {/* Headline row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.06)", flexShrink: 0, ...shimmerStyle }} />
                <div style={{ flex: 1 }}>
                    <div style={{ height: 16, borderRadius: 6, background: "rgba(255,255,255,0.07)", marginBottom: 8, ...shimmerStyle }} />
                    <div style={{ height: 12, width: "70%", borderRadius: 6, background: "rgba(255,255,255,0.05)", ...{ ...shimmerStyle, animationDelay: "0.2s" } }} />
                </div>
            </div>
            {/* Summary */}
            <div style={{ height: 38, borderRadius: 8, background: "rgba(255,255,255,0.04)", ...{ ...shimmerStyle, animationDelay: "0.1s" } }} />
        </div>
    );
}

export function NewsGridSkeleton() {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
}
