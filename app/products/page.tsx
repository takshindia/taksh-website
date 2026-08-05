"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { encodeId } from "@/lib/utils";
import Skeleton from "@/app/components/ui/Skeleton";
import EmptyState from "@/app/components/ui/EmptyState";

type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
  discount_price: number | null;
  stock: number;
  featured: boolean;
  category?: string;
};

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image_url: string;
};

const CART_KEY = "taksh_cart";
const WISHLIST_KEY = "taksh_wishlist";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    loadProducts();
    loadWishlist();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setProducts(data as Product[]);
    }

    setLoading(false);
  }

  function loadWishlist() {
    const saved = localStorage.getItem(WISHLIST_KEY);
    const items = saved ? (JSON.parse(saved) as WishlistItem[]) : [];
    setWishlist(items);
  }

  function saveWishlist(items: WishlistItem[]) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    setWishlist(items);
  }

  function toggleWishlist(product: Product) {
    const exists = wishlist.some((item) => item.id === product.id);
    const itemPrice =
      product.discount_price && product.discount_price > 0
        ? product.discount_price
        : product.price;

    const updated = exists
      ? wishlist.filter((item) => item.id !== product.id)
      : [
          ...wishlist,
          {
            id: product.id,
            name: product.name,
            image_url: product.image_url,
            price: itemPrice,
          },
        ];

    saveWishlist(updated);
  }

  function addToCart(product: Product) {
    const saved = localStorage.getItem(CART_KEY);
    const cart = saved ? (JSON.parse(saved) as any[]) : [];
    const itemPrice =
      product.discount_price && product.discount_price > 0
        ? product.discount_price
        : product.price;

    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: itemPrice,
        image_url: product.image_url,
        qty: 1,
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    alert("🛒 Added to Cart");
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
    const filtered = products.filter((product) => {
      const text = `${product.name} ${product.description}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      const matchCategory =
        category === "All" || product.category === category;
      return matchSearch && matchCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceLow":
          return (
            (a.discount_price ?? a.price) -
            (b.discount_price ?? b.price)
          );
        case "priceHigh":
          return (
            (b.discount_price ?? b.price) -
            (a.discount_price ?? a.price)
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return b.id - a.id;
      }
    });
  }, [products, search, category, sortBy]);

  const wishlistIds = useMemo(
    () => wishlist.map((item) => item.id),
    [wishlist]
  );

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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap justify-center gap-3">
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

          <div className="flex items-center justify-center gap-3">
            <label className="text-gray-400 mr-2">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111] border border-yellow-500/30 rounded-xl px-3 py-2 outline-none"
            >
              <option value="latest">Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#151515] border border-yellow-500/20 rounded-2xl overflow-hidden">
                <div className="relative">
                  <div className="w-full h-56"><Skeleton className="w-full h-full" /></div>
                </div>
                <div className="p-5">
                  <div className="h-6 w-3/4 mb-3"><Skeleton height={20} width="75%" /></div>
                  <div className="h-4 w-full mb-6"><Skeleton height={16} /></div>
                  <div className="h-8 w-1/3"><Skeleton height={32} width="33%" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState title="No Products Found" message="Try adjusting your search or filters." action={{ href: "/products", label: "Browse All" }} />
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
                    <button
                      onClick={() => toggleWishlist(p)}
                      aria-label={wishlistIds.includes(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                      className="absolute top-3 right-3 z-10 text-2xl"
                    >
                      {wishlistIds.includes(p.id) ? "❤️" : "🤍"}
                    </button>
                    <Image
                      src={
                        p.image_url ||
                        "/no-image.png"
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
  <span className="absolute top-14 right-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold">
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

                      <p className={`mt-3 font-semibold ${p.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                        {p.stock > 0 ? (p.stock <= 5 ? `Low Stock (${p.stock})` : `In Stock (${p.stock})`) : "Out of Stock"}
                      </p>

                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">

                      <Link
                        href={`/products/${encodeId(p.id)}`}
                        className="flex-1 text-center bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition"
                      >
                        View Details
                      </Link>

                      <button
                        className="flex-1 border border-yellow-500 text-yellow-400 py-3 rounded-xl hover:bg-yellow-500 hover:text-black transition disabled:opacity-50"
                        onClick={() => addToCart(p)}
                        disabled={p.stock === 0}
                        aria-disabled={p.stock === 0}
                      >
                        Add To Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(p)}
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl transition"
                      >
                        ❤️ Wishlist
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