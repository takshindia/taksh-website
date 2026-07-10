"use client";

import React from "react";

interface Order {
  id: string;
  customer_name: string;
  mobile: string;
  address: string;
  city?: string;
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

export default function Invoice({ order }: InvoiceProps) {
  const invoiceNumber = `TAKSH-${String(order.id).slice(0, 8)}-${new Date().getFullYear()}`;

  const downloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("taksh-invoice");
    if (!element) return;

    html2pdf()
      .set({
        margin: 10,
        filename: `TAKSH-${order.id}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };

  return (
    <div
      id="taksh-invoice"
      style={{
        background: "white",
        color: "black",
        padding: "40px",
        borderRadius: "10px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#d4af37",
          marginBottom: "5px",
        }}
      >
        तक्ष (TAKSH)
      </h1>

      <p>Premium Laser Engraving & Personalized Gifts</p>

      <hr />

      <h2>Invoice</h2>

      <p>
        <strong>Invoice No:</strong> {invoiceNumber}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(order.created_at || Date.now()).toLocaleDateString("en-IN")}
      </p>

      <hr />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <tbody>
          <tr>
            <td><strong>Customer</strong></td>
            <td>{order.customer_name}</td>
          </tr>

          <tr>
            <td><strong>Mobile</strong></td>
            <td>{order.mobile}</td>
          </tr>

          <tr>
            <td><strong>Address</strong></td>
            <td>{order.address}</td>
          </tr>

          <tr>
            <td><strong>Product</strong></td>
            <td>{order.product_name}</td>
          </tr>

          <tr>
            <td><strong>Quantity</strong></td>
            <td>{order.quantity || 1}</td>
          </tr>

          <tr>
            <td><strong>Payment</strong></td>
            <td>{order.payment_status}</td>
          </tr>

          <tr>
            <td><strong>Status</strong></td>
            <td>{order.status}</td>
          </tr>

          <tr>
            <td><strong>Total Amount</strong></td>
            <td>₹{order.amount}</td>
          </tr>
        </tbody>
      </table>

      <hr style={{ margin: "30px 0" }} />

      <div
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
        }}
      >
        Thank you for shopping with <strong>तक्ष</strong> ❤️
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <button
          onClick={downloadPDF}
          style={{
            background: "#d4af37",
            color: "#000",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
}