import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "100px 20px 60px",
        background:
          "linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
      }}
    >
      <Image
        src="/taksh-logo.png"
        alt="तक्ष Logo"
        width={420}
        height={320}
        priority
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "auto",
          marginBottom: "30px",
        }}
      />

      <h1
        style={{
          color: "#ffffff",
          fontSize: "clamp(34px,6vw,64px)",
          fontWeight: "700",
          lineHeight: "1.2",
          margin: 0,
        }}
      >
        Premium Laser
        <br />
        Engraving &
        <br />
        Personalized Gifts
      </h1>

      <p
        style={{
          color: "#cfcfcf",
          marginTop: "28px",
          fontSize: "clamp(16px,2vw,22px)",
          maxWidth: "760px",
          lineHeight: "1.8",
          padding: "0 10px",
        }}
      >
        Luxury laser engraved gifts, personalized jewellery, wooden crafts,
        acrylic products, corporate gifting and custom creations made with
        precision and premium finishing.
      </p>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <Link
          href="/products"
          style={{
            background: "#d4af37",
            color: "#111",
            padding: "16px 36px",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "18px",
            transition: "0.3s",
          }}
        >
          Explore Collection
        </Link>

        <Link
          href="/contact"
          style={{
            border: "2px solid #d4af37",
            color: "#d4af37",
            padding: "16px 36px",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          Contact Us
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px",
          marginTop: "45px",
        }}
      >
        {[
          "Laser Engraving",
          "Personalized Gifts",
          "Wood Craft",
          "Acrylic",
          "Corporate Gifts",
          "Custom Orders",
        ].map((item) => (
          <span
            key={item}
            style={{
              border: "1px solid #333",
              color: "#d4af37",
              padding: "10px 18px",
              borderRadius: "30px",
              fontSize: "14px",
              background: "#151515",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}