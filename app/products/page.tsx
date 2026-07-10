"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

const filteredProducts = products.filter((p) =>
  `${p.name} ${p.description}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*");

    setProducts(data || []);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "60px 20px",
      }}
    >
      <h1
        style={{
          color: "#d4af37",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        Our Products
      </h1>
<div
  style={{
    maxWidth: "500px",
    margin: "0 auto 40px",
  }}
>
  <input
    type="text"
    placeholder="🔍 Search Products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      width: "100%",
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #d4af37",
      background: "#111",
      color: "white",
      fontSize: "16px",
    }}
  />
</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "25px",
        }}
      >
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#151515",
              borderRadius: "15px",
              padding: "20px",
            }}
          >
            <img
              src={p.image_url}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <h2 style={{ color: "#d4af37" }}>
              {p.name}
            </h2>

            <p>{p.description}</p>

            <h3>₹ {p.price}</h3>
            <p
  style={{
    color: p.stock > 0 ? "#22c55e" : "#ef4444",
    fontWeight: "bold",
    marginTop: "8px",
  }}
>
  {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
</p>
            <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <Link
    href={`/products/${p.id}`}
    style={{
      flex: 1,
      background: "#d4af37",
      color: "#111",
      padding: "12px",
      textAlign: "center",
      textDecoration: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    }}
  >
    View Details
  </Link>

  <button
    onClick={() => alert("Cart feature next")}
    style={{
      flex: 1,
      background: "#222",
      color: "white",
      border: "1px solid #d4af37",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    Add to Cart
  </button>
</div>
          </div>
        ))}
      </div>
    </main>
  );
}