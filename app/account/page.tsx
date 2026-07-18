"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
        });
      }

      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400">
        Welcome, {user?.user_metadata?.full_name || "User"} 👋
      </h1>

      <p className="text-gray-400 mt-2">{user?.email}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
        <a href="/profile" className="rounded-2xl bg-[#111] border border-yellow-500/20 p-6">
          👤 Profile
        </a>

        <a href="/my-orders" className="rounded-2xl bg-[#111] border border-yellow-500/20 p-6">
          📦 My Orders
        </a>

        <a href="/wishlist" className="rounded-2xl bg-[#111] border border-yellow-500/20 p-6">
          ❤️ Wishlist
        </a>

        <a href="/addresses" className="rounded-2xl bg-[#111] border border-yellow-500/20 p-6">
          📍 Addresses
        </a>
      </div>

      <button
        onClick={logout}
        className="mt-10 rounded-xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-500"
      >
        Logout
      </button>
    </div>
  );
}