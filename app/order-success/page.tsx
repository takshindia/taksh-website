"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#090909,#111111,#090909)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "#151515",
          border: "1px solid rgba(212,175,55,.25)",
          borderRadius: "22px",
          padding: "45px",
          textAlign: "center",
          boxShadow: "0 0 40px rgba(212,175,55,.08)",
        }}
      >
        <div
          style={{
            fontSize: "82px",
            marginBottom: "20px",
          }}
        >
          🎉
        </div>

        <h1
          style={{
            color: "#d4af37",
            fontSize: "42px",
            marginBottom: "18px",
          }}
        >
          Order Placed Successfully!
        </h1>

        <p
          style={{
            color: "#d0d0d0",
            fontSize: "18px",
            lineHeight: "32px",
            marginBottom: "35px",
          }}
        >
          Thank you for shopping with
          <strong> तक्ष (TAKSH)</strong>.
          <br />
          Your payment has been received successfully.
          <br />
          We have started processing your order.
        </p>

        <div
          style={{
            background: "#1b1b1b",
            border: "1px solid rgba(212,175,55,.2)",
            borderRadius: "15px",
            padding: "22px",
            marginBottom: "35px",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              color: "#d4af37",
              marginBottom: "15px",
            }}
          >
            What happens next?
          </h2>

          <p>✅ Order Confirmation Email Sent</p>

          <p>✅ Payment Verified</p>

          <p>📦 Order Preparation Started</p>

          <p>🚚 Shipping Details will be shared soon</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/products"
            style={{
              background: "#d4af37",
              color: "#000",
              padding: "15px 28px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            style={{
              background: "#222",
              color: "#fff",
              border: "1px solid #d4af37",
              padding: "15px 28px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Back To Home
          </Link>
        </div>

        <p
          style={{
            color: "#8f8f8f",
            fontSize: "14px",
            marginTop: "35px",
            lineHeight: "24px",
          }}
        >
          Need help with your order?
          <br />
          📧 Email: taksh.support03@gmail.com
          <br />
          💬 WhatsApp support is also available from the Contact page.
        </p>
      </div>
    </main>
  );
}