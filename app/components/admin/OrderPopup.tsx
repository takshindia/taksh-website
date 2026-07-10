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
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#111",
          color: "white",
          width: "90%",
          maxWidth: "850px",
          borderRadius: "12px",
          padding: "25px",
          border: "2px solid #d4af37",
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
            gap: "10px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <a
            href={`tel:${order.mobile}`}
            style={{
              background: "#0ea5e9",
              color: "white",
              padding: "10px 16px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            📞 Call
          </a>

          <a
            href={`https://wa.me/91${order.mobile}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#22c55e",
              color: "white",
              padding: "10px 16px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            💬 WhatsApp
          </a>

          <button
            onClick={() => navigator.clipboard.writeText(order.address)}
            style={{
              background: "#d4af37",
              color: "black",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            📋 Copy Address
          </button>
          <button
            onClick={() => window.print()}
            style={{
              background: "#ffffff",
              color: "#000",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🖨️ Print Invoice
          </button>

          <button
            onClick={onClose}
            style={{
              background: "#ef4444",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}