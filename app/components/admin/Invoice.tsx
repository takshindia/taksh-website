"use client";

import React from "react";

interface Order {
  id: string;
  customer_name: string;
  mobile: string;
  address: string;
  city?: string;
  pincode?: string;
  product_name: string;
  quantity?: number;
  amount: number;
  payment_status: string;
  status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at?: string;
}

interface InvoiceProps {
  order: Order;
}

export default function Invoice({
  order,
}: InvoiceProps) {

  const invoiceNo = `TAKSH-${order.id}-${new Date().getFullYear()}`;

  async function downloadPDF() {
    const html2pdf = (await import("html2pdf.js")).default;

    const element =
      document.getElementById("taksh-invoice");
      const button = document.querySelector(".no-print") as HTMLElement;

if (button) {
  button.style.display = "none";
}

    if (!element) return;
    

if (button) {
  button.style.display = "none";
}

   await html2pdf()
      .set({
        margin: 5,
        filename: `${invoiceNo}.pdf`,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 2,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
      if (button) {
  button.style.display = "block";
}
  }

  return (
    <div
      id="taksh-invoice"
      style={{
        background: "#fff",
        color: "#111",
        padding: "25px",
        borderRadius: "16px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}

    >
      <h1
        style={{
          color: "#d4af37",
          margin: 0,
          fontSize: "42px",
        }}
      >
        तक्ष
      </h1>

      <p
        style={{
          marginTop: "8px",
          color: "#666",
        }}
      >
        Premium Laser Engraving & Personalized Gifts
      </p>

      <hr style={{ margin: "25px 0" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ color: "#d4af37" }}>
            Customer Details
          </h2>

          <p>
            <strong>Name :</strong> {order.customer_name}
          </p>

          <p>
            <strong>Mobile :</strong> {order.mobile}
          </p>

          <p>
            <strong>Address :</strong> {order.address}
          </p>

          <p>
            <strong>City :</strong> {order.city || "-"}
          </p>

          <p>
            <strong>Pincode :</strong> {order.pincode || "-"}
          </p>
        </div>

        <div>
          <h2 style={{ color: "#d4af37" }}>
            Invoice Details
          </h2>

          <p>
            <strong>Invoice :</strong> {invoiceNo}
          </p>

          <p>
            <strong>Date :</strong>{" "}
            {new Date(
              order.created_at || Date.now()
            ).toLocaleDateString("en-IN")}
          </p>

          <p>
            <strong>Status :</strong> {order.status}
          </p>

          <p>
            <strong>Payment :</strong>{" "}
            {order.payment_status}
          </p>
        </div>
      </div>

      <hr style={{ margin: "25px 0" }} />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead
          style={{
            background: "#d4af37",
            color: "#000",
          }}
        >
          <tr>
            <th style={{ padding: "12px" }}>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ padding: "12px" }}>
              {order.product_name}
            </td>

            <td style={{ textAlign: "center" }}>
              {order.quantity || 1}
            </td>

            <td style={{ textAlign: "center" }}>
              ₹{order.amount}
            </td>

            <td
              style={{
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ₹{order.amount}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            width: "320px",
            border: "2px solid #d4af37",
            borderRadius: "12px",
            padding: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>Subtotal</span>
            <strong>₹{order.amount}</strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>Shipping</span>
            <strong>FREE</strong>
          </div>

          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
              fontSize: "22px",
              color: "#d4af37",
              fontWeight: "bold",
            }}
          >
            <span>Total</span>
            <span>₹{order.amount}</span>
          </div>
        </div>
      </div>

      <hr style={{ margin: "15px 0" }} />

      <div
        style={{
          textAlign: "center",
          color: "#666",
          lineHeight: "28px",
        }}
      >
        <p>
          Thank you for shopping with <strong>तक्ष (TAKSH)</strong>.
        </p>

        <p>
          Premium Laser Engraving • Personalized Gifts • Made with तक्ष❤️ in India
        </p>
      </div>

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
        }}
      >
      </div>
       <button
  onClick={downloadPDF}
  className="no-print"
  style={{
    background: "#d4af37",
    color: "#000",
    border: "none",
    padding: "14px 30px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  }}
>
  📄 Download PDF Invoice
</button>
    </div>
    
  );
}
