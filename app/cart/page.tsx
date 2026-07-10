"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
            qty: item.qty > 1 ? item.qty - 1 : 1,
          }
        : item
    );

    updateCart(updated);
  }

  function removeItem(id: number) {
    const updated = cart.filter(
      (item) => item.id !== id
    );

    updateCart(updated);
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
    (sum, item) => sum + item.qty * item.price,
    0
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        padding: "40px",
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
            fontSize: "40px",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          Shopping Cart
        </h1>
        {cart.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#151515",
              borderRadius: "16px",
            }}
          >
            <h2 style={{ color: "#d4af37" }}>
              🛒 Your Cart is Empty
            </h2>

            <p style={{ color: "#ccc", marginTop: "10px" }}>
              Add some amazing TAKSH products.
            </p>

            <Link
              href="/products"
              style={{
                display: "inline-block",
                marginTop: "25px",
                background: "#d4af37",
                color: "#000",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
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
                  background: "#151515",
                  borderRadius: "15px",
                  padding: "20px",
                  marginBottom: "20px",
                  alignItems: "center",
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h2>{item.name}</h2>

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
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "15px",
                    }}
                  >
                    <button
                      onClick={() => decreaseQty(item.id)}
                    >
                      −
                    </button>

                    <strong>{item.qty}</strong>

                    <button
                      onClick={() => increaseQty(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  🗑 Remove
                </button>
              </div>
            ))}
            <div
              style={{
                background: "#151515",
                borderRadius: "15px",
                padding: "25px",
                marginTop: "30px",
              }}
            >
              <h2
                style={{
                  color: "#d4af37",
                  marginBottom: "20px",
                }}
              >
                Order Summary
              </h2>

              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span>Total Items</span>
                <strong>{totalItems}</strong>
              </p>

              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <span>Total Amount</span>
                <strong>₹ {totalAmount}</strong>
              </p>

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
                    color: "#fff",
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
                    color: "#000",
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