"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import EmptyState from "@/app/components/ui/EmptyState";

interface Order {
  id: string;

  customer_name: string;

  product_name: string;

  quantity: number;

  amount: number;

  payment_status: string;

  status: string;

  created_at: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!error && data) {
    setOrders(data);
  }

  setLoading(false);
}

return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">
          My Orders
        </h1>

        <p className="text-gray-400 mb-8">
          Track all your personalized orders.
        </p>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-yellow-500/20 bg-[#111] p-6">
                <div className="h-6 w-1/2 bg-[#111] animate-pulse mb-4" />
                <div className="h-4 bg-[#111] animate-pulse mb-2" />
                <div className="h-4 bg-[#111] animate-pulse" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState title="No Orders Found" message="You haven't placed any orders yet." action={{ href: "/products", label: "Shop Now" }} />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-yellow-500/20 bg-[#111] p-6"
              >
                <h2 className="text-2xl font-bold text-yellow-400">
                  {order.product_name}
                </h2>

                <div className="mt-4 space-y-2 text-gray-300">
                  <p>
                    <span className="font-semibold text-white">Customer:</span>{" "}
                    {order.customer_name}
                  </p>

                  <p>
                    <span className="font-semibold text-white">Quantity:</span>{" "}
                    {order.quantity}
                  </p>

                  <p>
                    <span className="font-semibold text-white">Amount:</span>{" "}
                    ₹{order.amount}
                  </p>

                  <p>
                    <span className="font-semibold text-white">Payment:</span>{" "}
                    <span className="text-green-400">
                      {order.payment_status}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold text-white">Order Status:</span>{" "}
                    <span className="text-yellow-400">
                      {order.status}
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold text-white">Order Date:</span>{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <div className="mt-4">
                    <a
                      href={`/orders/${order.id}`}
                      className="inline-block rounded-xl bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
  