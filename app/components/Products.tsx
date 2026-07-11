import Link from "next/link";

export default function Products() {
  const categories = [
    {
      icon: "🎁",
      title: "Personalized Gifts",
      description:
        "Necklace, Bracelet, Ring, Keychain, Photo Frame, Wallet, Pen, Phone Cover and many more.",
    },
    {
      icon: "🪵",
      title: "Laser Materials",
      description:
        "MDF, Plywood, Basswood, Acrylic, Leather, Slate, Cork, Bamboo and more.",
    },
    {
      icon: "🔩",
      title: "Accessories",
      description:
        "Magnets, Key Rings, Chains, Hooks, Glue, Gift Boxes and Packaging.",
    },
    {
      icon: "🏢",
      title: "Corporate Gifts",
      description:
        "Company Branding, Bulk Orders, Name Plates, QR Stands and Office Gifts.",
    },
    {
      icon: "❤️",
      title: "Wedding Gifts",
      description:
        "Wedding Name Boards, Couple Gifts, Invitation Gifts and Return Gifts.",
    },
    {
      icon: "🎂",
      title: "Birthday Gifts",
      description:
        "Custom Birthday Gifts, Photo Frames, Cake Toppers and Personalized Items.",
    },
  ];

  return (
    <section
      style={{
        background: "#0d0d0d",
        padding: "90px 20px",
        color: "white",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#d4af37",
          fontSize: "clamp(34px,5vw,52px)",
          marginBottom: "15px",
        }}
      >
        Explore Our Categories
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#bdbdbd",
          maxWidth: "700px",
          margin: "0 auto 60px",
          lineHeight: "1.8",
          fontSize: "18px",
        }}
      >
        Discover premium laser engraved products crafted with precision for
        gifting, business branding and custom orders.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "30px",
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        {categories.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#171717",
              border: "1px solid rgba(212,175,55,.25)",
              borderRadius: "20px",
              padding: "30px",
              transition: "0.3s",
            }}
          >
            <div
              style={{
                fontSize: "45px",
                marginBottom: "15px",
              }}
            >
              {item.icon}
            </div>

            <h3
              style={{
                color: "#d4af37",
                fontSize: "24px",
                marginBottom: "15px",
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                color: "#d0d0d0",
                lineHeight: "1.8",
                minHeight: "90px",
              }}
            >
              {item.description}
            </p>

            <Link
              href="/products"
              style={{
                display: "inline-block",
                marginTop: "25px",
                padding: "12px 22px",
                background: "#d4af37",
                color: "#111",
                textDecoration: "none",
                borderRadius: "30px",
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