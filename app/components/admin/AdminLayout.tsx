"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("taksh_admin");

    if (admin !== "loggedin") {
      router.replace("/admin/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("taksh_admin");
    router.replace("/admin/login");
  }

  const menu = [
    { name: "Dashboard", href: "/admin", icon: "🏠" },
    { name: "Products", href: "/admin/products", icon: "📦" },
    { name: "Categories", href: "/admin/categories", icon: "📂" },
    { name: "Orders", href: "/admin/orders", icon: "🛒" },
    { name: "Customers", href: "/admin/customers", icon: "👥" },
    { name: "Reviews", href: "/admin/reviews", icon: "⭐" },
    { name: "Gallery", href: "/admin/gallery", icon: "🖼️" },
    { name: "Offers", href: "/admin/offers", icon: "🎁" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 bg-[#111] border-r border-yellow-500/20 p-6">

        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/taksh-logo.png"
            alt="TAKSH"
            width={150}
            height={150}
            priority
            className="object-contain"
          />

          <p className="text-xs text-gray-400 tracking-[4px] uppercase mt-2">
            ADMIN PANEL
          </p>
        </div>

        <div className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition ${
                pathname === item.href
                  ? "bg-yellow-500 text-black font-bold"
                  : "hover:bg-[#1b1b1b] text-white"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}

          <button
            onClick={logout}
            className="w-full mt-8 bg-red-600 hover:bg-red-700 rounded-lg px-4 py-3 font-bold"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
    