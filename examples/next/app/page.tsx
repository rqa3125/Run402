export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 40, lineHeight: 1.6 }}>
      <h1>Run402 · Next.js example</h1>
      <p>
        A protected route lives at <code>GET /api/premium</code>. It returns 402
        until paid, then 200 with a valid <code>x-run402-token</code>.
      </p>
      <pre style={{ background: "#f4f4f4", padding: 16, borderRadius: 8 }}>
        {`curl -i http://localhost:4001/api/premium`}
      </pre>
      <p>
        Set <code>RUN402_SECRET_KEY</code> and register a{" "}
        <code>GET /api/premium</code> sandbox endpoint in the dashboard.
      </p>
    </main>
  );
}
