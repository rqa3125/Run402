"use client";

/**
 * Last-resort boundary for errors thrown in the root layout itself. Must render
 * its own <html>/<body> because the app shell may not exist.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Application error</h1>
          <p style={{ color: "#666", marginTop: 8 }}>
            {error.digest ? `Reference: ${error.digest}` : "Please try again."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              borderRadius: 8,
              background: "#111",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
