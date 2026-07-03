import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px",
          backgroundImage:
            "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${site.url}/logo-mark.png`}
            width={64}
            height={64}
            style={{ width: 64, height: 64, borderRadius: 14 }}
            alt=""
          />
          <div style={{ fontSize: 34, fontWeight: 600, color: "#111" }}>
            Run402
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#111",
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Monetize any API without writing billing code.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#666" }}>
            Install one package. Protect one endpoint. Start charging.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            fontFamily: "monospace",
            color: "#111",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid #eaeaea",
              background: "#f8f8f8",
            }}
          >
            $ npm install run402
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
