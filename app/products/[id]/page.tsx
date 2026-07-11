"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProduct(data);

    const { data: related } = await supabase
      .from("products")
      .select("*")
      .neq("id", id)
      .limit(4);

    setRelatedProducts(related || []);

    setLoading(false);
  }

  function addToCart() {
    if (!product) return;

    let cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const index = cart.findIndex(
      (item: any) => item.id === product.id
    );

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
  }
  function buyNow() {
    addToCart();
    router.push("/checkout");
  }

  function whatsappOrder() {
    if (!product) return;

    const message = encodeURIComponent(`Hello तक्ष 👋

I want to order this product.

Product: ${product.name}
Price: ₹${product.price}

Please contact me.`);

    window.open(
      `https://wa.me/919664644034?text=${message}`,
      "_blank"
    );
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        Loading Product...
      </main>
    );
  }

  if (!product) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        Product Not Found
      </main>
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
          <Image
            src={
              product.image_url ||
              "https://via.placeholder.com/600x600"
            }
            alt={product.name}
            width={600}
            height={600}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "20px",
              objectFit: "cover",
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
              {product.description ||
                "Premium personalized product from तक्ष."}
            </p>
            <div
              style={{
                display: "grid",
                gap: "15px",
                marginTop: "35px",
              }}
            >
              <button
                onClick={addToCart}
                style={{
                  padding: "16px",
                  background: "#d4af37",
                  color: "#111",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "18px",
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
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "18px",
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
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                💬 Order on WhatsApp
              </button>
            </div>

            <div
              style={{
                marginTop: "40px",
                background: "#151515",
                padding: "22px",
                borderRadius: "16px",
                border: "1px solid rgba(212,175,55,.2)",
              }}
            >
              <h3
                style={{
                  color: "#d4af37",
                  marginBottom: "18px",
                }}
              >
                Why Choose तक्ष?
              </h3>

              <ul
                style={{
                  color: "#ddd",
                  lineHeight: "32px",
                  paddingLeft: "20px",
                }}
              >
                <li>✅ Premium Quality Materials</li>
                <li>✅ Precision Laser Engraving</li>
                <li>✅ Personalized Designs</li>
                <li>✅ Secure Online Payment</li>
                <li>✅ Fast Shipping Across India</li>
                <li>✅ Friendly Customer Support</li>
              </ul>
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "70px" }}>
            <h2
              style={{
                color: "#d4af37",
                fontSize: "32px",
                marginBottom: "30px",
              }}
            >
              Related Products
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(240px,1fr))",
                gap: "25px",
              }}
            >
              {relatedProducts.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#151515",
                    border: "1px solid rgba(212,175,55,.2)",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={
                      item.image_url ||
                      "https://via.placeholder.com/400"
                    }
                    alt={item.name}
                    width={400}
                    height={300}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: "18px" }}>
                    <h3
                      style={{
                        color: "#d4af37",
                        marginBottom: "10px",
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        marginBottom: "18px",
                      }}
                    >
                      ₹ {item.price}
                    </p>

                    <Link
                      href={`/products/${item.id}`}
                      style={{
                        display: "inline-block",
                        background: "#d4af37",
                        color: "#111",
                        textDecoration: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}