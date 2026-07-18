"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "../components/admin/AdminLayout";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const isAdmin = window.localStorage.getItem("admin");

    if (isAdmin !== "true") {
      router.push("/admin/login");
      return;
    }

    void loadDashboard();
  }, [router]);

  async function loadDashboard() {
    try {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load dashboard stats.");
      }

      const payload = await response.json();
      const orders = payload.recentOrders || [];
      const uniqueCustomers = new Set(
        orders.map((order: any) => order.mobile || order.customer_name)
      );

      setStats({
        products: Number(payload.products || 0),
        categories: Number(payload.categories || 0),
        orders: Number(payload.orders || 0),
        customers: uniqueCustomers.size,
        revenue: Number(payload.revenue || 0),
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Dashboard load failed:", error);
      setStats({
        products: 0,
        categories: 0,
        orders: 0,
        customers: 0,
        revenue: 0,
      });
      setRecentOrders([]);
    }
  }

  const cards = [
    { title: "📦 Products", value: stats.products, link: "/admin/products" },
    { title: "📂 Categories", value: stats.categories, link: "/admin/categories" },
    { title: "🛒 Orders", value: stats.orders, link: "/admin/orders" },
    { title: "👥 Customers", value: stats.customers, link: "/admin/customers" },
    { title: "💰 Revenue", value: `₹${stats.revenue}`, link: "/admin/orders" },
  ];
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-yellow-400">
            Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Welcome to TAKSH Admin Panel
          </p>
        </div>

        <Link
          href="/admin/products"
          className="bg-yellow-500 text-black px-5 py-3 rounded-lg font-bold"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className="bg-[#181818] border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500 transition"
          >
            <h2 className="text-gray-400 text-sm">
              {card.title}
            </h2>

            <p className="text-4xl font-bold text-yellow-400 mt-3">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <Link
          href="/admin/orders"
          className="bg-[#1b1b1b] rounded-xl p-6 border border-yellow-500/20"
        >
          <h2 className="text-yellow-400 text-xl font-bold mb-3">
            🛒 Orders
          </h2>

          <p className="text-gray-300">
            View and manage customer orders.
          </p>
        </Link>

        <Link
          href="/admin/customers"
          className="bg-[#1b1b1b] rounded-xl p-6 border border-yellow-500/20"
        >
          <h2 className="text-yellow-400 text-xl font-bold mb-3">
            👥 Customers
          </h2>

          <p className="text-gray-300">
            View all registered customers.
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-[#1b1b1b] rounded-xl p-6 border border-yellow-500/20"
        >
          <h2 className="text-yellow-400 text-xl font-bold mb-3">
            📂 Categories
          </h2>

          <p className="text-gray-300">
            Create and edit product categories.
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="bg-[#1b1b1b] rounded-xl p-6 border border-yellow-500/20"
        >
          <h2 className="text-yellow-400 text-xl font-bold mb-3">
            📦 Products
          </h2>

          <p className="text-gray-300">
            Add, edit and delete products.
          </p>
        </Link>

      </div>
      <div className="bg-[#181818] border border-yellow-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          🕒 Recent Orders
        </h2>

        {recentOrders.length === 0 ? (
          <p className="text-gray-400">
            No Orders Yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-yellow-500/20">
                  <th className="py-3">Customer</th>
                  <th className="py-3">Mobile</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-700"
                  >
                    <td className="py-3">
                      {order.customer_name || "-"}
                    </td>

                    <td className="py-3">
                      {order.mobile || "-"}
                    </td>

                    <td className="py-3 text-yellow-400 font-bold">
                      ₹{order.amount}
                    </td>

                    <td className="py-3">
                      <span className="bg-green-600 px-3 py-1 rounded text-sm">
                        {order.status || "Paid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}