export default function TermsPage() {
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
        Terms & Conditions
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
          All personalized products are custom-made and therefore cannot be
          returned or exchanged once production has started.
        </p>

        <br />

        <p>
          Customers must verify all names, photos, and custom details before
          confirming their orders.
        </p>

        <br />

        <p>
          तक्ष reserves the right to refuse any inappropriate or illegal
          content requests.
        </p>
      </div>
    </main>
  );
}