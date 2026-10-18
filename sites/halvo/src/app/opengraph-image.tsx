import { ImageResponse } from "next/og";

export const alt = "Halvo: operations that run themselves";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The social preview card shown when a Halvo link is shared.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#07080a",
        color: "#f3eee4",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -140,
          top: -60,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background: "radial-gradient(closest-side, #c96a1f 0%, #f5a65b 86%, #fff0db 97%, #ffb36b 100%)",
          boxShadow: "0 0 160px 20px rgba(245,166,91,0.45)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -128,
          top: -42,
          width: 606,
          height: 606,
          borderRadius: 9999,
          background: "#07080a",
          display: "flex",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 9999,
            background: "linear-gradient(45deg, #b35f1b, #f5a65b 55%, #ffe6c4)",
            display: "flex",
          }}
        />
        halvo
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 92, lineHeight: 1, letterSpacing: -4, fontWeight: 600, display: "flex" }}>
          Operations that
        </div>
        <div
          style={{
            fontSize: 92,
            lineHeight: 1.05,
            letterSpacing: -4,
            fontWeight: 600,
            color: "#f5a65b",
            display: "flex",
          }}
        >
          run themselves.
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#a39f97", display: "flex" }}>
          AI agents for finance, support and revenue operations
        </div>
      </div>
    </div>,
    size,
  );
}
