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

  async function refreshTracking() {
    if (!order.shipment_id) {
      alert("Shipment not created yet.");
      return;
    }

    try {
      const res = await fetch(
        `/api/shiprocket/track?shipment_id=${order.shipment_id}`
      );

      if (!res.ok) {
        throw new Error();
      }

      alert("✅ Tracking Updated Successfully");
      window.location.reload();
    } catch {
      alert("❌ Unable to refresh tracking.");
    }
  }

  function openTracking() {
    if (!order.tracking_url) {
      alert("Tracking URL not available yet.");
      return;
    }

    window.open(order.tracking_url, "_blank");
  }

  async function downloadLabel() {
    if (!order.shipment_id) {
      alert("Shipment not created yet.");
      return;
    }

    const res = await fetch(
      `/api/shiprocket/label?shipment_id=${order.shipment_id}`
    );

    const data = await res.json();

    if (data?.label_url) {
      window.open(data.label_url, "_blank");
    } else {
      alert("Label not available yet.");
    }
  }

  async function downloadInvoice() {
    if (!order.shipment_id) {
      alert("Shipment not created yet.");
      return;
    }

    const res = await fetch(
      `/api/shiprocket/invoice?shipment_id=${order.shipment_id}`
    );

    const data = await res.json();

    if (data?.invoice_url) {
      window.open(data.invoice_url, "_blank");
    } else {
      alert("Invoice not available yet.");
    }
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
        marginTop: "25px",
        padding: "20px",
        border: "1px solid #d4af37",
        borderRadius: "12px",
        background: "#181818",
      }}
    >
      <h3 style={{ color: "#d4af37", marginBottom: "15px" }}>
        🚚 Shipping
      </h3>

      <p><b>Status:</b> {order.tracking_status || order.status}</p>

      <p><b>Courier:</b> {order.courier_name || "-"}</p>

      <p><b>AWB:</b> {order.awb_code || "-"}</p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "15px",
        }}
      >
        <button onClick={openTracking}>
          🚚 Track Shipment
        </button>

        <button onClick={downloadLabel}>
          🏷️ Download Label
        </button>

        <button onClick={downloadInvoice}>
          📄 Download Invoice
        </button>

        <button onClick={refreshTracking}>
          🔄 Refresh Status
        </button>
      </div>
    </div>

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