"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });
      console.log("Orders:", data);

    
    
      console.log(data);

    const unique = new Map();

    (data || []).forEach((o: any) => {
      if (!unique.has(o.mobile)) {
        unique.set(o.mobile, {
          name: o.customer_name,
          mobile: o.mobile,
          city: o.city,
          address: o.address,
          orders: 1,
          total: Number(o.amount || 0),
        });
      } else {
        const c = unique.get(o.mobile);
        c.orders += 1;
        c.total += Number(o.amount || 0);
      }
    });
console.log("UNIQUE =", Array.from(unique.values()));
setCustomers(Array.from(unique.values()));


    
  }

  const filtered = customers.filter((c) =>
    `${c.name} ${c.mobile}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">

       <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl text-yellow-400 font-bold">
    Customers
  </h1>

  <span className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">
    Total: {filtered.length}
  </span>
</div>

        <input
          className="w-full bg-black border border-yellow-500 p-3 text-white rounded mb-6"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4">
          {filtered.map((c, i) => (
            <div
              key={i}
              className="bg-[#1b1b1b] border border-yellow-500/20 rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <h2 className="text-yellow-400 text-xl font-bold">
                  {c.name}
                </h2>

                <p className="text-gray-300">
                  📱 {c.mobile}
                </p>

                <p className="text-gray-400">
                  📍 {c.city}
                </p>

                <p className="text-gray-500 text-sm">
                  {c.address}
                </p>
              </div>

              <div className="text-right">
                <p className="text-white">
                  Orders : {c.orders}
                </p>

                <p className="text-green-400 font-bold">
                  ₹{c.total}
                </p>
                <div className="flex gap-2 mt-3 justify-end">
  <a
    href={`tel:${c.mobile}`}
    className="bg-blue-600 px-3 py-2 rounded text-white"
  >
    📞
  </a>

  <a
    href={`https://wa.me/91${c.mobile}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-600 px-3 py-2 rounded text-white"
  >
    💬
  </a>
</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}