"use client";

import { Order } from "@/app/admin/orders/page";

interface Props {
  orders: Order[];
  onRowClick: (order: Order) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function OrdersTable({
  orders,
  onRowClick,
  onStatusChange,
}: Props) {
  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid #333",
        borderRadius: "10px",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            background: "#1b1b1b",
          }}
        >
          <tr>
            <th style={{ padding: "12px" }}>Customer</th>
            <th>Mobile</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
            {orders.map((order) => (
  <tr
    key={order.id}
    onClick={() => onRowClick(order)}
    style={{
      borderBottom: "1px solid #333",
      cursor: "pointer",
    }}
  >
    <td style={{ padding: "12px" }}>
      {order.customer_name}
    </td>

    <td>{order.mobile}</td>

    <td>{order.product_name}</td>

    <td>₹{order.amount}</td>

    <td>{order.payment_status}</td>

    <td
      onClick={(e) => e.stopPropagation()}
    >
      <select
        value={order.status}
        onChange={(e) =>
          onStatusChange(order.id, e.target.value)
        }
        style={{
          background: "#222",
          color: "white",
          border: "1px solid #d4af37",
          borderRadius: "6px",
          padding: "6px",
        }}
      >
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
}