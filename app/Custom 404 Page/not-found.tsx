import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "100px",
          color: "#d4af37",
          margin: 0,
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: "32px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          color: "#aaa",
          maxWidth: "500px",
          marginBottom: "40px",
        }}
      >
        The page you are looking for does not exist.
      </p>

      <Link
        href="/"
        style={{
          background: "#d4af37",
          color: "#111",
          padding: "15px 30px",
          borderRadius: "50px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Return Home
      </Link>
    </main>
  );
}