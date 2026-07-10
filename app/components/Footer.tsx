import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a0a0a",
        color: "white",
        padding: "60px 20px 30px",
        borderTop: "1px solid rgba(212,175,55,0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Link href="/">
          <Image
            src="/favicon.png"
            alt="TAKSH"
            width={120}
            height={120}
            priority
            style={{
              width: "120px",
              height: "auto",
              margin: "0 auto 20px",
              cursor: "pointer",
              display: "block",
            }}
          />
        </Link>

        <p
          style={{
            color: "#bdbdbd",
            maxWidth: "700px",
            margin: "0 auto 30px",
            lineHeight: "1.8",
          }}
        >
          Premium Laser Engraving, Personalized Gifts, Custom Woodcraft,
          Jewellery Engraving and Corporate Gift Solutions.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <Link href="/" style={{ color: "#d4af37", textDecoration: "none" }}>Home</Link>
          <Link href="/products" style={{ color: "#d4af37", textDecoration: "none" }}>Products</Link>
          <Link href="/about" style={{ color: "#d4af37", textDecoration: "none" }}>About</Link>
          <Link href="/contact" style={{ color: "#d4af37", textDecoration: "none" }}>Contact</Link>
          <Link href="/privacy" style={{ color: "#d4af37", textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ color: "#d4af37", textDecoration: "none" }}>Terms</Link>
        </div>

        <p>📞 Business: +91 9664644034</p>
        <p>👤 V J MANCHHATAR - +91 7069496531</p>
        <p>👤 T J MANCHHATAR - +91 9737664137</p>

        <p style={{ marginTop: "20px" }}>
          📷 Instagram :
          <a
            href="https://instagram.com/mm._arts_gifts"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#d4af37",
              textDecoration: "none",
              marginLeft: "8px",
            }}
          >
            @mm._arts_gifts
          </a>
        </p>

        <p
          style={{
            marginTop: "40px",
            color: "#777",
            fontSize: "14px",
          }}
        >
          © 2026 TAKSH. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}