"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { decodeId, encodeId } from "@/lib/utils";

interface Review {
  id: number;
  product_id: number;
  customer_name: string;
  rating: number;
  review: string;
  created_at: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const averageRating = useMemo(() => {
    if (!reviews.length) return "0.0";
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    setLoading(true);

    const internalId = decodeId(id as string);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(internalId))
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProduct(data);
    await fetchReviews(data.id);

    const { data: related } = await supabase
      .from("products")
      .select("*")
      .neq("id", Number(internalId))
      .limit(4);

    setRelatedProducts(related || []);
    setLoading(false);
  }

  async function fetchReviews(productId: number) {
    setReviewLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setReviews(data || []);
    }

    setReviewLoading(false);
  }

  async function submitReview() {
    if (!customerName.trim() || !reviewText.trim()) {
      setReviewError("Please enter your name and a review.");
      return;
    }

    try {
      setReviewError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const email = user?.email;

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          customer_name: customerName.trim(),
          rating,
          review: reviewText.trim(),
          email,
        }),
      });

      const json = await res.json();

      if (!json.ok) {
        setReviewError(json.error || "Could not submit your review.");
        return;
      }

      setCustomerName("");
      setReviewText("");
      setRating(5);
      setReviewSubmitted(true);
    } catch (err) {
      console.error(err);
      setReviewError("Could not submit your review. Please try again.");
    }
  }

  function addToCart() {
    if (!product) return;
    if (product.stock === 0) {
      alert("This product is out of stock.");
      return;
    }

    const saved = localStorage.getItem("taksh_cart");
    const cart = saved ? (JSON.parse(saved) as any[]) : [];

    const finalPrice =
      product.discount_price && product.discount_price > 0
        ? product.discount_price
        : product.price;

    const index = cart.findIndex((item: any) => item.id === product.id);

    if (index >= 0) {
      cart[index].qty += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: finalPrice,
        image_url: product.image_url,
        qty: quantity,
      });
    }

    localStorage.setItem("taksh_cart", JSON.stringify(cart));
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
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "40px",
            marginTop: "24px",
            alignItems: "center",
          }}
        >
          <Image
            priority
            src={product.image_url || "https://via.placeholder.com/600x600"}
            alt={product.name}
            width={500}
            height={500}
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
            <div
              style={{
                color: "#facc15",
                fontSize: "18px",
                marginBottom: "15px",
              }}
            >
              {reviews.length > 0 ? (
                <>
                  {"⭐".repeat(Math.round(Number(averageRating)))}
                  {"☆".repeat(5 - Math.round(Number(averageRating)))}
                  {" "}
                  ({averageRating}) • {reviews.length} Reviews
                </>
              ) : (
                <>☆☆☆☆☆ (0.0) • 0 Reviews</>
              )}
            </div>
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
                color: product.stock > 0 ? "#22c55e" : "#ef4444",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              {product.stock > 0
                ? product.stock <= 5
                  ? `⚠️ Low Stock (${product.stock})`
                  : `✅ In Stock (${product.stock})`
                : "❌ Out of Stock"}
            </p>
            <p
              style={{
                color: "#cccccc",
                lineHeight: "30px",
                fontSize: "18px",
              }}
            >
              {product.description || "Premium personalized product from तक्ष."}
            </p>
            <div
              style={{
                marginTop: "20px",
                color: "#ccc",
                lineHeight: "32px",
              }}
            >
              🚚 Delivery in 3-7 Days
              <br />
              🔒 Secure Payment
              <br />
              🔄 Easy Replacement
              <br />
              🇮🇳 Made in India
            </div>
            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "5px",
                  marginTop: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                    margin: "20px 0",
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "none",
                      background: "#d4af37",
                      color: "#111",
                      fontSize: "22px",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>

                  <span
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "none",
                      background: "#d4af37",
                      color: "#111",
                      fontSize: "22px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  aria-disabled={product.stock === 0}
                  style={{
                    padding: "16px",
                    background: product.stock === 0 ? "#444" : "#d4af37",
                    color: "#111",
                    border: "none",
                    borderRadius: "12px",
                    cursor: product.stock === 0 ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  🛒 Add To Cart
                </button>

                <button
                  onClick={buyNow}
                  disabled={product.stock === 0}
                  aria-disabled={product.stock === 0}
                  style={{
                    padding: "16px",
                    background: product.stock === 0 ? "#222" : "#222",
                    color: "#fff",
                    border: product.stock === 0 ? "1px solid #333" : "1px solid #d4af37",
                    borderRadius: "12px",
                    cursor: product.stock === 0 ? "not-allowed" : "pointer",
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
                  Customer Reviews
                </h3>

                {reviewLoading ? (
                  <p style={{ color: "#ccc" }}>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p style={{ color: "#aaa" }}>No reviews yet.</p>
                ) : (
                  <div style={{ display: "grid", gap: "18px" }}>
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        style={{
                          background: "#111",
                          borderRadius: "16px",
                          padding: "18px",
                          border: "1px solid rgba(255,255,255,.08)",
                        }}
                      >
                        <div style={{ marginBottom: "10px", color: "#facc15" }}>
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <p style={{ color: "#fff", fontWeight: "bold" }}>
                          {review.customer_name}
                        </p>
                        <p style={{ color: "#ccc", marginTop: "10px" }}>
                          {review.review}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: "28px" }}>
                  <h4 style={{ color: "#facc15", marginBottom: "12px" }}>
                    Add Your Review
                  </h4>
                  {reviewSubmitted && (
                    <div style={{ marginBottom: "16px", color: "#22c55e" }}>
                      Thank you! Your review was submitted and will appear once approved.
                    </div>
                  )}
                  {reviewError && (
                    <div style={{ marginBottom: "16px", color: "#f87171" }}>
                      {reviewError}
                    </div>
                  )}
                  <input
                    value={customerName}
                    onChange={(e) => {
                      setReviewSubmitted(false);
                      setReviewError("");
                      setCustomerName(e.target.value);
                    }}
                    placeholder="Your name"
                    style={{
                      width: "100%",
                      background: "#111",
                      border: "1px solid #333",
                      borderRadius: "12px",
                      padding: "14px",
                      color: "white",
                      marginBottom: "12px",
                    }}
                  />
                  <textarea
                    value={reviewText}
                    onChange={(e) => {
                      setReviewSubmitted(false);
                      setReviewError("");
                      setReviewText(e.target.value);
                    }}
                    placeholder="Write your review..."
                    rows={4}
                    style={{
                      width: "100%",
                      background: "#111",
                      border: "1px solid #333",
                      borderRadius: "12px",
                      padding: "14px",
                      color: "white",
                      marginBottom: "12px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "18px",
                    }}
                  >
                    <span style={{ color: "#ccc" }}>Rating:</span>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{
                        background: "#111",
                        border: "1px solid #333",
                        borderRadius: "12px",
                        padding: "12px",
                        color: "white",
                      }}
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} Star{value > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={submitReview}
                    style={{
                      width: "100%",
                      background: "#d4af37",
                      color: "#111",
                      border: "none",
                      padding: "16px",
                      borderRadius: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
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
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
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
                    priority
                    src={item.image_url || "https://via.placeholder.com/400"}
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
                      href={`/products/${encodeId(item.id)}`}
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
