"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "../components/admin/AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { count: products } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    const { count: categories } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    const { data: orders } = await supabase
      .from("orders")
      .select("amount,mobile");

    const unique = new Set(
      (orders || []).map((o: any) => o.mobile || o.customer_name)
    );

    const revenue = (orders || []).reduce(
      (sum: number, o: any) => sum + Number(o.amount || 0),
      0
    );

    setStats({
      products: products || 0,
      categories: categories || 0,
      orders: orders?.length || 0,
      customers: unique.size,
      revenue,
    });
  }

  const cards = [
    { title: "📦 Products", value: stats.products },
    { title: "📂 Categories", value: stats.categories },
    { title: "🛒 Orders", value: stats.orders },
    { title: "👥 Customers", value: stats.customers },
    { title: "💰 Revenue", value: `₹${stats.revenue}` },
  ];

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-[#1b1b1b] border border-yellow-500/20 rounded-xl p-6"
          >
            <h2 className="text-gray-300">{card.title}</h2>
            <p className="text-4xl font-bold text-yellow-400 mt-3">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}