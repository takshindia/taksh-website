export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#d4af37",
            fontSize: "52px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          About तक्ष
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#bdbdbd",
            lineHeight: "1.8",
            marginBottom: "60px",
          }}
        >
          तक्ष is a premium laser engraving and personalized gifting brand,
          creating unique products with precision, quality and creativity.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "25px",
          }}
        >
          <div
            style={{
              background: "#151515",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "20px",
              padding: "25px",
            }}
          >
            <h2 style={{ color: "#d4af37" }}>🎯 Our Mission</h2>
            <p style={{ color: "#d0d0d0", lineHeight: "1.8" }}>
              To provide premium personalized gifts and laser engraved products
              with outstanding quality and customer satisfaction.
            </p>
          </div>

          <div
            style={{
              background: "#151515",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "20px",
              padding: "25px",
            }}
          >
            <h2 style={{ color: "#d4af37" }}>💎 Why Choose तक्ष?</h2>
            <p style={{ color: "#d0d0d0", lineHeight: "1.8" }}>
              Premium finishing, custom designs, fast support and carefully
              crafted products for every occasion.
            </p>
          </div>

          <div
            style={{
              background: "#151515",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "20px",
              padding: "25px",
            }}
          >
            <h2 style={{ color: "#d4af37" }}>⚡ Our Expertise</h2>
            <p style={{ color: "#d0d0d0", lineHeight: "1.8" }}>
              Wood engraving, metal engraving, acrylic work, personalized gifts,
              business branding and custom laser projects.
            </p>
          </div>

          <div
            style={{
              background: "#151515",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "20px",
              padding: "25px",
            }}
          >
            <h2 style={{ color: "#d4af37" }}>❤️ Our Promise</h2>
            <p style={{ color: "#d0d0d0", lineHeight: "1.8" }}>
              Every order is made with care, precision and attention to detail
              so that every customer receives something truly special.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}