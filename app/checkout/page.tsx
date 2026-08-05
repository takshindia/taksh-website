"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  qty: number;
}

const CART_KEY = "taksh_cart";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    async function loadAddresses() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setEmail(user.email);
      }

      if (!user) return;

      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setAddresses(data);
        const a = data[0];
        setSelectedAddress(a.id);
        setName(a.full_name || "");
        setMobile(a.phone || "");
        setAddress(`${a.address_line1} ${a.address_line2 || ""}`.trim());
        setCity(a.city || "");
        setPincode(a.pincode || "");
      }
    }

    function loadCart() {
      const saved = localStorage.getItem(CART_KEY);
      const items = saved ? (JSON.parse(saved) as CartItem[]) : [];
      setCart(items);
    }

    loadCart();
    loadAddresses();
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const discountedAmount = appliedCoupon
    ? Math.max(0, Math.round(totalAmount * (1 - appliedCoupon.discount / 100)))
    : totalAmount;

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  async function placeOrder() {
    const selected = addresses.find((a) => a.id === selectedAddress);

    const orderName = selected?.full_name || name;
    const orderMobile = selected?.phone || mobile;
    const orderAddress = selected?.address_line1
      ? `${selected.address_line1} ${selected.address_line2 || ""}`.trim()
      : address;
    const orderCity = selected?.city || city;
    const orderPincode = selected?.pincode || pincode;
    const orderEmail = email;

    if (
      !orderName ||
      !orderMobile ||
      !orderEmail ||
      !orderAddress ||
      !orderCity ||
      !orderPincode
    ) {
      alert("Please fill all details.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount: discountedAmount,
          }),
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "तक्ष (TAKSH)",
        description: "Premium Personalized Order",
        order_id: order.id,
        handler: async function (response: any) {
          const productNames = cart.map((item) => item.name).join(", ");

          await fetch("/api/save-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_name: orderName,
              mobile: orderMobile,
              email: orderEmail,
              address: orderAddress,
              city: orderCity,
              pincode: orderPincode,
              product_name: productNames,
              quantity: totalQty,
                    amount: discountedAmount,
                    original_amount: totalAmount,
                    coupon_code: appliedCoupon?.code || null,
                    coupon_discount: appliedCoupon?.discount || 0,
              payment_status: "Paid",
              status: "Pending",
              razorpay_order_id: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
            }),
          });

          localStorage.removeItem(CART_KEY);
          alert("✅ Payment Successful");
          router.push("/order-success");
        },
        prefill: {
          name: orderName,
          email: orderEmail,
          contact: orderMobile,
        },
        theme: {
          color: "#d4af37",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong.");
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

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
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              color: "#d4af37",
              fontSize: "40px",
              marginBottom: "30px",
            }}
          >
            Checkout
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {addresses.length > 0 && (
                <div
                  style={{
                    background: "#151515",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      color: "#d4af37",
                      marginBottom: "15px",
                    }}
                  >
                    Saved Addresses
                  </h3>

                  {addresses.map((item) => (
                    <label
                      key={item.id}
                      style={{
                        display: "block",
                        padding: "12px",
                        marginBottom: "10px",
                        border:
                          selectedAddress === item.id
                            ? "2px solid #d4af37"
                            : "1px solid #333",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        checked={selectedAddress === item.id}
                        onChange={() => {
                          setSelectedAddress(item.id);
                          setName(item.full_name || "");
                          setMobile(item.phone || "");
                          setAddress(
                            `${item.address_line1} ${item.address_line2 || ""}`.trim()
                          );
                          setCity(item.city || "");
                          setPincode(item.pincode || "");
                        }}
                      />
                      <span style={{ marginLeft: "10px" }}>
                        {item.full_name}, {item.phone}
                        <br />
                        {item.address_line1} {item.address_line2}
                        <br />
                        {item.city} – {item.pincode}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gap: "15px",
                }}
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  style={{
                    background: "#111",
                    color: "white",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                  }}
                />
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile number"
                  style={{
                    background: "#111",
                    color: "white",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                  }}
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  style={{
                    background: "#111",
                    color: "white",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                  }}
                />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  rows={4}
                  style={{
                    background: "#111",
                    color: "white",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                    resize: "vertical",
                  }}
                />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  style={{
                    background: "#111",
                    color: "white",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                  }}
                />
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  style={{
                    background: "#111",
                    color: "white",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                  }}
                />
              </div>
            </div>

              <div
              style={{
                background: "#151515",
                padding: "25px",
                borderRadius: "20px",
                border: "1px solid rgba(212,175,55,.15)",
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

                <div style={{ marginBottom: 12 }}>
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Have a coupon code?"
                    style={{ width: "60%", background: "#111", color: "white", border: "1px solid #333", borderRadius: "8px", padding: "10px" }}
                  />
                  <button
                    onClick={async () => {
                      setCouponError("");
                      if (!couponCode.trim()) {
                        setCouponError("Enter a coupon code.");
                        return;
                      }

                      try {
                        const res = await fetch(`/api/validate-coupon`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ code: couponCode.trim() }),
                        });

                        const json = await res.json();

                        if (!json.ok) {
                          setCouponError(json.error || "Invalid coupon code.");
                          setAppliedCoupon(null);
                          return;
                        }

                        const found = json.coupon;
                        setAppliedCoupon({ code: found.coupon_code, discount: Number(found.discount || 0) });
                      } catch (err) {
                        console.error(err);
                        setCouponError("Could not validate coupon. Try again.");
                      }
                    }}
                    style={{ marginLeft: 8, background: "#d4af37", color: "#111", padding: "10px 12px", borderRadius: 8, fontWeight: "bold" }}
                  >
                    Apply
                  </button>
                  {couponError && <div style={{ color: "#f87171", marginTop: 8 }}>{couponError}</div>}
                  {appliedCoupon && <div style={{ color: "#22c55e", marginTop: 8 }}>Applied {appliedCoupon.code} — {appliedCoupon.discount}% off</div>}
                </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span>Items</span>
                <span>{totalQty}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "25px",
                }}
              >
                <span>Total</span>
                <strong
                  style={{
                    color: "#d4af37",
                    fontSize: "24px",
                  }}
                >
                  ₹{totalAmount}
                </strong>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#d4af37",
                  color: "#111",
                  border: "none",
                  padding: "18px",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {loading ? "Processing..." : "Pay with Razorpay"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
