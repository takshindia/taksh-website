"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  discount_price: number;
  stock: number;
  featured: boolean;
  category: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setProducts((data || []) as Product[]);
    }

    setLoading(false);
  }

  const categories = [
    "All",
    "Necklace",
    "Bracelet",
    "Ring",
    "Keychain",
    "Frame",
    "Wood",
    "Acrylic",
    "Corporate",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const text =
        `${p.name} ${p.description}`
          .toLowerCase();

      const matchSearch =
        text.includes(search.toLowerCase());

      const matchCategory =
        category === "All" ||
        p.category === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);
  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold text-center text-yellow-400">
          Premium Collection
        </h1>

        <p className="text-center text-gray-400 mt-3 mb-8">
          {filteredProducts.length} Products Found
        </p>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="🔍 Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl bg-[#111] border border-yellow-500/30 rounded-xl px-4 py-3 outline-none focus:border-yellow-400"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                category === c
                  ? "bg-yellow-500 text-black"
                  : "bg-[#1b1b1b] text-white hover:bg-yellow-500 hover:text-black"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading Products...
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map((p) => {

              const hasOffer =
                Number(p.discount_price) > 0;

              const finalPrice =
                hasOffer
                  ? Number(p.discount_price)
                  : Number(p.price);

              const discount =
                hasOffer
                  ? Math.round(
                      ((Number(p.price) - Number(p.discount_price)) /
                        Number(p.price)) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={p.id}
                  className="bg-[#151515] border border-yellow-500/20 rounded-2xl overflow-hidden hover:border-yellow-500 transition"
                >

                  <div className="relative">
                    <Image
                      src={
                        p.image_url ||
                        "https://via.placeholder.com/500"
                      }
                      alt={p.name}
                      width={500}
                      height={500}
                      className="w-full h-56 object-cover"
                    />

                    {p.featured && (
                      <span className="absolute top-3 left-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ Featured
                      </span>
                    )}

                    {hasOffer && (
                      <span className="absolute top-3 right-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-5">

                    <h2 className="text-xl font-bold text-yellow-400">
                      {p.name}
                    </h2>

                    <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="mt-5">

                      {hasOffer ? (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-white">
                            ₹{finalPrice}
                          </span>

                          <span className="text-gray-500 line-through">
                            ₹{p.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          ₹{p.price}
                        </span>
                      )}

                      <p
                        className={`mt-3 font-semibold ${
                          p.stock > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {p.stock > 0
                          ? `In Stock (${p.stock})`
                          : "Out of Stock"}
                      </p>

                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">

                      <Link
                        href={`/products/${p.id}`}
                        className="flex-1 text-center bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition"
                      >
                        View Details
                      </Link>

                      <button
                        className="flex-1 border border-yellow-500 text-yellow-400 py-3 rounded-xl hover:bg-yellow-500 hover:text-black transition"
                        onClick={() => alert("Add to Cart Coming Soon")}
                      >
                        Add To Cart
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>

    </main>
  );
}