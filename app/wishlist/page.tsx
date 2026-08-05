"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import EmptyState from "@/app/components/ui/EmptyState";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const WISHLIST_KEY = "taksh_wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  function loadWishlist() {
    setLoading(true);
    const saved = localStorage.getItem(WISHLIST_KEY);
    const parsed = saved ? (JSON.parse(saved) as WishlistItem[]) : [];
    setItems(parsed);
    setLoading(false);
  }

  function removeWishlist(id: number) {
    const saved = localStorage.getItem(WISHLIST_KEY);
    const cart = saved ? (JSON.parse(saved) as WishlistItem[]) : [];
    const updated = cart.filter((item) => item.id !== id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    setItems(updated);
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold text-yellow-400">My Wishlist ❤️</h1>

        <p className="mb-8 text-gray-400">Your favourite products.</p>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-[#111]">
                <div className="h-56 w-full"><div className="animate-pulse bg-[#111] h-full" /></div>
                <div className="p-5">
                  <div className="h-6 w-3/4 mb-3 bg-[#111] animate-pulse" />
                  <div className="h-8 w-1/3 bg-[#111] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Wishlist is Empty" message="Add products to your wishlist." action={{ href: "/products", label: "Browse Products" }} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-[#111]">
                <Image src={item.image_url || "/placeholder.png"} alt={item.name} width={500} height={500} className="h-56 w-full object-cover" />

                <div className="p-5">
                  <h2 className="text-xl font-bold text-yellow-400">{item.name}</h2>

                  <p className="mt-3 text-2xl font-bold">₹{item.price}</p>

                  <button onClick={() => removeWishlist(item.id)} className="mt-5 w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-700">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}