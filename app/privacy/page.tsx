export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "80px 30px",
      }}
    >
      <h1
        style={{
          color: "#d4af37",
          textAlign: "center",
          fontSize: "50px",
          marginBottom: "40px",
        }}
      >
        Privacy Policy
      </h1>

      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          lineHeight: "2",
          fontSize: "18px",
        }}
      >
        <p>
          तक्ष respects your privacy. Any personal information shared with us
          for custom orders, inquiries, or communication will remain completely
          confidential.
        </p>

        <br />

        <p>
          We do not sell, trade, or share your personal data with third parties
          without your permission.
        </p>

        <br />

        <p>
          Your contact information is used only for order updates, customer
          support, and business communication.
        </p>
      </div>
    </main>
  );
}