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

  function statusColor(status: string) {
    switch (status) {
      case "Delivered":
        return "#22c55e";

      case "Processing":
        return "#3b82f6";

      case "Shipped":
        return "#a855f7";

      case "Cancelled":
        return "#ef4444";

      default:
        return "#eab308";
    }
  }

  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid #333",
        borderRadius: "12px",
        background: "#111",
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
            <th style={{ padding: "14px" }}>Customer</th>

            <th>Mobile</th>

            <th>Product</th>

            <th>Amount</th>

            <th>Payment</th>

            <th>Status</th>

            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
          <tr
            key={order.id}
            onClick={() => onRowClick(order)}
            style={{
              borderBottom: "1px solid #2a2a2a",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            <td style={{ padding: "14px", fontWeight: "bold" }}>
              {order.customer_name}
            </td>

            <td>{order.mobile}</td>

            <td>{order.product_name}</td>

            <td
              style={{
                color: "#d4af37",
                fontWeight: "bold",
              }}
            >
              ₹{order.amount}
            </td>

            <td>
              <span
                style={{
                  color:
                    order.payment_status === "Paid"
                      ? "#22c55e"
                      : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {order.payment_status}
              </span>
            </td>

            <td
              onClick={(e) => e.stopPropagation()}
            >
              <select
                value={order.status}
                onChange={(e) =>
                  onStatusChange(order.id, e.target.value)
                }
                style={{
                  background: statusColor(order.status),
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </td>

            <td>
              {new Date(order.created_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
        {orders.length === 0 && (
          <tr>
            <td
              colSpan={7}
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#888",
              }}
            >
              No Orders Found
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}