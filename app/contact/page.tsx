export default function ContactPage() {
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
          maxWidth: "900px",
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
          Contact तक्ष
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#bdbdbd",
            marginBottom: "50px",
            lineHeight: "1.8",
          }}
        >
          We'd love to hear from you. Contact us for custom laser engraving,
          personalized gifts, bulk orders or any business inquiry.
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
            <h2 style={{ color: "#d4af37" }}>📞 Business</h2>
            <p>+91 9664644034</p>

            <h2 style={{ color: "#d4af37", marginTop: "25px" }}>👤 V J MANCHHATAR</h2>
            <p>+91 7069496531</p>

            <h2 style={{ color: "#d4af37", marginTop: "25px" }}>👤 T J MANCHHATAR</h2>
            <p>+91 9737664137</p>
          </div>

          <div
            style={{
              background: "#151515",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: "20px",
              padding: "25px",
            }}
          >
            <h2 style={{ color: "#d4af37" }}>📧 Email</h2>
            <p>contact@taksh.in</p>

            <h2 style={{ color: "#d4af37", marginTop: "25px" }}>📷 Instagram</h2>
            <a
              href="https://instagram.com/mm._arts_gifts"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#d4af37",
                textDecoration: "none",
              }}
            >
              @mm._arts_gifts
            </a>

            <h2 style={{ color: "#d4af37", marginTop: "25px" }}>📍 Address</h2>
            <p>Ahmedabad, Gujarat, India</p>
          </div>
        </div>

        <div
          style={{
            marginTop: "50px",
            background: "#151515",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#d4af37" }}>💬 WhatsApp</h2>

          <p style={{ marginBottom: "25px" }}>
            Click below to place your custom order instantly.
          </p>

          <a
            href="https://wa.me/919664644034?text=Hello%20तक्ष,%20I%20want%20to%20place%20a%20custom%20order."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#25D366",
              color: "white",
              padding: "15px 30px",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}