"use client";

import Invoice from "./Invoice";
import { Order } from "@/app/admin/orders/page";

interface Props {
  order: Order;
  onClose: () => void;
}

export default function OrderPopup({
  order,
  onClose,
}: Props) {

  function copyAddress() {
    navigator.clipboard.writeText(
      `${order.customer_name}

${order.address}

${order.city || ""}

Mobile : ${order.mobile}`
    );

    alert("✅ Address Copied");
  }

  function openWhatsapp() {
    const message = encodeURIComponent(
`Hello ${order.customer_name},

Your TAKSH order is currently:

📦 ${order.status}

Thank you for shopping with TAKSH ❤️`
    );

    window.open(
      `https://wa.me/91${order.mobile}?text=${message}`,
      "_blank"
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "92%",
          maxWidth: "900px",
          background: "#111",
          color: "white",
          borderRadius: "16px",
          border: "2px solid #d4af37",
          padding: "28px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            color: "#d4af37",
            marginBottom: "20px",
          }}
        >
          📦 Order Details
        </h2>

        <Invoice order={order} />
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <a
            href={`tel:${order.mobile}`}
            style={{
              background: "#0ea5e9",
              color: "white",
              padding: "12px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            📞 Call Customer
          </a>

          <button
            onClick={openWhatsapp}
            style={{
              background: "#22c55e",
              color: "white",
              padding: "12px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💬 WhatsApp Customer
          </button>

          <button
            onClick={copyAddress}
            style={{
              background: "#d4af37",
              color: "#000",
              padding: "12px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📋 Copy Address
          </button>

          <button
            onClick={() => window.print()}
            style={{
              background: "#fff",
              color: "#000",
              padding: "12px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🖨️ Print Invoice
          </button>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "#ef4444",
              color: "white",
              padding: "12px 18px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}