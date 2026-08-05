"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 24 }}>
        <h1 style={{ color: "#d4af37", fontSize: 36 }}>Something went wrong</h1>
        <p style={{ color: "#ccc", marginTop: 12 }}>An unexpected error occurred. Try refreshing the page.</p>
        <div style={{ marginTop: 18 }}>
          <button onClick={() => reset()} style={{ marginRight: 8, background: "#d4af37", color: "#111", padding: "10px 16px", borderRadius: 8, fontWeight: "bold" }}>Retry</button>
          <Link href="/" style={{ color: "#d4af37", marginLeft: 8 }}>Return Home</Link>
        </div>
      </div>
    </main>
  );
}
