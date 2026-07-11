"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  qty: number;
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const items = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(items);
  }, []);

  function updateCart(items: CartItem[]) {
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(items));
  }

  function increaseQty(id: number) {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, qty: item.qty + 1 }
        : item
    );

    updateCart(updated);
  }

  function decreaseQty(id: number) {
    const updated = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            qty: Math.max(1, item.qty - 1),
          }
        : item
    );

    updateCart(updated);
  }

  function removeItem(id: number) {
    updateCart(cart.filter((item) => item.id !== id));
  }

  function clearCart() {
    if (!confirm("Clear entire cart?")) return;

    updateCart([]);
  }

  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/products"
          style={{
            color: "#d4af37",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Continue Shopping
        </Link>

        <h1
          style={{
            color: "#d4af37",
            fontSize: "42px",
            marginTop: "25px",
            marginBottom: "35px",
          }}
        >
          🛒 Shopping Cart
        </h1>
        {cart.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              background: "#151515",
              padding: "80px 20px",
              borderRadius: "20px",
              border: "1px solid rgba(212,175,55,.2)",
            }}
          >
            <h2 style={{ color: "#d4af37", fontSize: "32px" }}>
              🛒 Your Cart is Empty
            </h2>

            <p
              style={{
                color: "#aaa",
                marginTop: "15px",
                fontSize: "18px",
              }}
            >
              Looks like you haven't added any products yet.
            </p>

            <Link
              href="/products"
              style={{
                display: "inline-block",
                marginTop: "30px",
                background: "#d4af37",
                color: "#111",
                textDecoration: "none",
                padding: "15px 35px",
                borderRadius: "12px",
                fontWeight: "bold",
              }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  background: "#151515",
                  padding: "20px",
                  borderRadius: "18px",
                  border: "1px solid rgba(212,175,55,.15)",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={120}
                  height={120}
                  style={{
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h2 style={{ marginBottom: "10px" }}>
                    {item.name}
                  </h2>

                  <h3
                    style={{
                      color: "#d4af37",
                    }}
                  >
                    ₹ {item.price}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginTop: "15px",
                    }}
                  >
                    <button onClick={() => decreaseQty(item.id)}>
                      −
                    </button>

                    <strong>{item.qty}</strong>

                    <button onClick={() => increaseQty(item.id)}>
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🗑 Remove
                </button>
              </div>
            ))}
            <div
              style={{
                background: "#151515",
                borderRadius: "18px",
                border: "1px solid rgba(212,175,55,.2)",
                padding: "30px",
                marginTop: "35px",
              }}
            >
              <h2
                style={{
                  color: "#d4af37",
                  marginBottom: "25px",
                }}
              >
                Order Summary
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span>Total Items</span>
                <strong>{totalItems}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "25px",
                }}
              >
                <span>Total Amount</span>
                <strong
                  style={{
                    color: "#d4af37",
                    fontSize: "22px",
                  }}
                >
                  ₹ {totalAmount}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={clearCart}
                  style={{
                    flex: 1,
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "15px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🗑 Clear Cart
                </button>

                <button
                  onClick={() => router.push("/checkout")}
                  style={{
                    flex: 2,
                    background: "#d4af37",
                    color: "#111",
                    border: "none",
                    padding: "15px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}