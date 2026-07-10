import Link from "next/link";

export default function Products() {
  const categories = [
    {
      title: "🎁 Personalized Gifts",
      description: "Necklace, Bracelet, Ring, Keychain, Photo Frame & more",
    },
    {
      title: "🪵 Laser Materials",
      description: "MDF, Plywood, Basswood, Acrylic, Leather & more",
    },
    {
      title: "🔩 Accessories",
      description: "Magnets, Chains, Glue, Key Rings, Hooks & more",
    },
    {
      title: "🏢 Corporate Gifts",
      description: "Bulk Orders, Office Gifts & Business Branding",
    },
  ];

  return (
    <section
      style={{
        background: "#111",
        padding: "80px 20px",
        color: "white",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#d4af37",
          fontSize: "42px",
          marginBottom: "50px",
        }}
      >
        Explore Categories
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "25px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {categories.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "20px",
              padding: "25px",
            }}
          >
            <h3 style={{ color: "#d4af37" }}>{item.title}</h3>

            <p
              style={{
                color: "#ccc",
                lineHeight: "1.7",
                marginTop: "15px",
              }}
            >
              {item.description}
            </p>

            <Link
              href="/products"
              style={{
                display: "inline-block",
                marginTop: "20px",
                color: "#d4af37",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              View Products →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}