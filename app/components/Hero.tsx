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
        padding: "80px 20px 40px",
        background: "#0a0a0a",
      }}
    >
      <Image
        src="/taksh-logo.png"
        alt="TAKSH Logo"
        width={500}
        height={400}
        priority
        style={{
          width: "500px",
          height: "auto",
          marginBottom: "25px",
          maxWidth: "90%",
        }}
      />

      <h2
        style={{
          color: "white",
          fontSize: "48px",
          fontWeight: "700",
          lineHeight: "1.3",
          margin: "0",
        }}
      >
        Premium Laser Engraving
        <br />
        & Personalized Gifts
      </h2>

      <p
        style={{
          color: "#bdbdbd",
          marginTop: "25px",
          fontSize: "20px",
          maxWidth: "700px",
          lineHeight: "1.8",
        }}
      >
        Premium personalized gifts, laser engraving, woodcraft,
        jewellery engraving, acrylic products and custom creations.
      </p>

      <Link
        href="/products"
        style={{
          marginTop: "40px",
          background: "#d4af37",
          color: "#111",
          padding: "16px 40px",
          borderRadius: "50px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Explore Collection
      </Link>
    </section>
  );
}