"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    setLoading(true);

    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setItems(data);
    }

    setLoading(false);
  }

  async function removeWishlist(id: number) {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadWishlist();
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold text-yellow-400">
          My Wishlist ❤️
        </h1>

        <p className="mb-8 text-gray-400">
          Your favourite products.
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-yellow-500/20 bg-[#111] p-10 text-center">
            <h2 className="text-2xl font-bold text-yellow-400">
              Wishlist is Empty
            </h2>

            <p className="mt-3 text-gray-400">
              Add products to your wishlist.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-[#111]"
              >
                <Image
                 src={item.image_url || "/placeholder.png"}
                  alt={item.name}
                  width={500}
                  height={500}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold text-yellow-400">
                    {item.name}
                  </h2>

                  <p className="mt-3 text-2xl font-bold">
                    ₹{item.price}
                  </p>

                  <button
                    onClick={() => removeWishlist(item.id)}
                    className="mt-5 w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}