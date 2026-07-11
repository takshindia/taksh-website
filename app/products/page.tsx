"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id");

    setProducts(data || []);
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

  const filteredProducts = products.filter((p) => {
    const matchesSearch = `${p.name} ${p.description}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || p.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "50px 20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#d4af37",
          fontSize: "42px",
          marginBottom: "15px",
        }}
      >
        Premium Collection
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#999",
          marginBottom: "35px",
        }}
      >
        {filteredProducts.length} Products Found
      </p>

      <input
        type="text"
        placeholder="🔍 Search Products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "550px",
          display: "block",
          margin: "0 auto",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #d4af37",
          background: "#111",
          color: "white",
          fontSize: "16px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          marginTop: "30px",
          marginBottom: "40px",
        }}
      >
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: "10px 18px",
              borderRadius: "30px",
              cursor: "pointer",
              border: "none",
              whiteSpace: "nowrap",
              background:
                category === c ? "#d4af37" : "#1b1b1b",
              color:
                category === c ? "#111" : "white",
              fontWeight: "bold",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "30px",
        }}
      >
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#151515",
              border: "1px solid rgba(212,175,55,0.15)",
              borderRadius: "18px",
              overflow: "hidden",
              transition: "0.3s",
            }}
          >
            <img
              src={p.image_url}
              alt={p.name}
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "20px" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#d4af37",
                  color: "#111",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                ⭐ Bestseller
              </span>

              <h2
                style={{
                  color: "#d4af37",
                  marginBottom: "10px",
                }}
              >
                {p.name}
              </h2>

              <p
                style={{
                  color: "#ccc",
                  lineHeight: "1.6",
                  minHeight: "70px",
                }}
              >
                {p.description}
              </p>

              <h3
                style={{
                  color: "white",
                  marginTop: "18px",
                  fontSize: "24px",
                }}
              >
                ₹ {p.price}
              </h3>

              <p
                style={{
                  color: p.stock > 0 ? "#22c55e" : "#ef4444",
                  fontWeight: "bold",
                  marginTop: "8px",
                }}
              >
                {p.stock > 0
                  ? `In Stock (${p.stock})`
                  : "Out of Stock"}
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
                    textDecoration: "none",
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                  }}
                >
                  View Details
                </Link>

                <button
                  onClick={() => alert("Cart feature coming soon")}
                  style={{
                    flex: 1,
                    background: "#222",
                    color: "white",
                    border: "1px solid #d4af37",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
