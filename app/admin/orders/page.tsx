"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import OrdersTable from "../../components/admin/OrdersTable";
import OrderPopup from "../../components/admin/OrderPopup";

export interface Order {
  id: string;

  customer_name: string;
  email?: string;
  mobile: string;

  address: string;
  city?: string;
  pincode?: string;

  product_name: string;
  quantity: number;
  amount: number;

  payment_status: string;
  status: string;

  razorpay_order_id?: string;
  razorpay_payment_id?: string;

  shipment_id?: number;
  awb_code?: string;
  courier_name?: string;
  tracking_url?: string;
  tracking_status?: string;

  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function fetchOrders() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
  }

  useEffect(() => {
    fetchOrders();
  }, []);
  async function updateStatus(id: string, status: string) {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Status update failed.");
      }

      await fetchOrders();

      if (selectedOrder?.id === id) {
        setSelectedOrder({
          ...selectedOrder,
          status,
        });
      }
    } catch (error: any) {
      alert(error?.message || "Status update failed.");
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      (
        order.customer_name +
        order.mobile +
        order.product_name
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [orders, search]);
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#d4af37",
          fontSize: "34px",
          marginBottom: "25px",
        }}
      >
        🛒 Orders Management
      </h1>

      <input
        type="text"
        placeholder="Search Customer / Mobile / Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "25px",
          background: "#181818",
          color: "white",
          border: "1px solid #d4af37",
          borderRadius: "8px",
          outline: "none",
        }}
      />

      <OrdersTable
        orders={filteredOrders}
        onRowClick={setSelectedOrder}
        onStatusChange={updateStatus}
      />

      {selectedOrder && (
        <OrderPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </main>
  );
}