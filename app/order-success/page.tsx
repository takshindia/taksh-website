"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          width: "100%",
          background: "#151515",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          border: "1px solid rgba(212,175,55,.2)",
        }}
      >
        <div
          style={{
            fontSize: "70px",
            marginBottom: "20px",
          }}
        >
          ✅
        </div>

        <h1
          style={{
            color: "#d4af37",
            fontSize: "38px",
            marginBottom: "15px",
          }}
        >
          Order Placed Successfully!
        </h1>

        <p
          style={{
            color: "#cccccc",
            lineHeight: "30px",
            marginBottom: "35px",
          }}
        >
          Thank you for shopping with <strong>TAKSH</strong>.
          <br />
          Your payment has been received successfully.
          <br />
          We will start processing your order soon.
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/products"
            style={{
              background: "#d4af37",
              color: "#000",
              padding: "14px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            style={{
              background: "#222",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "10px",
              border: "1px solid #d4af37",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Back To Home
          </Link>
        </div>
      </div>
    </main>
  );
}