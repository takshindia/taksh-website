"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
    } else {
      setProduct(data);
    }

    setLoading(false);
  }

  function addToCart() {
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const index = cart.findIndex((item: any) => item.id === product.id);

    if (index >= 0) {
      cart[index].qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        qty: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("✅ Product Added To Cart");

    router.push("/cart");
  }

  function buyNow() {
    addToCart();
    router.push("/checkout");
  }

  function whatsappOrder() {
    const message = encodeURIComponent(
      `Hello TAKSH 👋

I want to order:

Product : ${product.name}
Price : ₹${product.price}

Please contact me.`
    );

    window.open(`https://wa.me/919664644034?text=${message}`, "_blank");
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0a0a",
          color: "white",
          fontSize: "22px",
        }}
      >
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0a0a",
          color: "white",
          fontSize: "22px",
        }}
      >
        Product Not Found
      </div>
    );
  }

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
          ← Back To Products
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
            gap: "50px",
            marginTop: "40px",
            alignItems: "center",
          }}
        >
          <img
            src={product.image_url || "https://via.placeholder.com/600x600"}
            alt={product.name}
            style={{
              width: "100%",
              borderRadius: "20px",
              objectFit: "cover",
              background: "#1a1a1a",
            }}
          />

          <div>
            <h1
              style={{
                color: "#d4af37",
                fontSize: "42px",
                marginBottom: "15px",
              }}
            >
              {product.name}
            </h1>

            <h2
              style={{
                fontSize: "34px",
                marginBottom: "20px",
              }}
            >
              ₹ {product.price}
            </h2>

            <p
              style={{
                color: "#cccccc",
                lineHeight: "30px",
                fontSize: "18px",
              }}
            >
              {product.description || "Premium personalized product from TAKSH."}
            </p>

            <div
              style={{
                marginTop: "35px",
                display: "grid",
                gap: "15px",
              }}
            >
              <button
                onClick={addToCart}
                style={{
                  padding: "16px",
                  background: "#d4af37",
                  color: "#000",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                🛒 Add To Cart
              </button>

              <button
                onClick={buyNow}
                style={{
                  padding: "16px",
                  background: "#222",
                  color: "#fff",
                  border: "1px solid #d4af37",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ⚡ Buy Now
              </button>

              <button
                onClick={whatsappOrder}
                style={{
                  padding: "16px",
                  background: "#25D366",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                💬 Order on WhatsApp
              </button>
            </div>

            <div
              style={{
                marginTop: "40px",
                background: "#151515",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid rgba(212,175,55,.2)",
              }}
            >
              <h3
                style={{
                  color: "#d4af37",
                  marginBottom: "15px",
                }}
              >
                Why Buy From TAKSH?
              </h3>

              <ul
                style={{
                  lineHeight: "32px",
                  color: "#ddd",
                  paddingLeft: "20px",
                }}
              >
                <li>✔ Premium Quality Materials</li>
                <li>✔ Personalized Engraving</li>
                <li>✔ Fast Shipping Across India</li>
                <li>✔ Secure Online Payment</li>
                <li>✔ Made with ❤️ by TAKSH</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
  