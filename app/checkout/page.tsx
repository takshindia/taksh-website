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

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    

    async function loadAddresses() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (data) {
    setAddresses(data);

    if (data.length > 0) {
      const a = data[0];

      setSelectedAddress(a.id);

      setName(a.full_name || "");
      setMobile(a.phone || "");
      setAddress(
        `${a.address_line1} ${a.address_line2 || ""}`.trim()
      );
      setCity(a.city || "");
      setPincode(a.pincode || "");
    }
  }
}

    async function loadCart() {
  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .order("id", { ascending: false });

  if (!error && data) {
    const items = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      qty: item.quantity,
    }));

    setCart(items);
  }
}
    loadCart();
    loadAddresses();

  }, []);

  
  

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const totalQty = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  async function placeOrder() {

    const selected = addresses.find(
  (a) => a.id === selectedAddress
);

if (selected) {
  setName(selected.full_name || "");
  setMobile(selected.phone || "");
  setAddress(
    `${selected.address_line1} ${selected.address_line2 || ""}`.trim()
  );
  setCity(selected.city || "");
  setPincode(selected.pincode || "");
}

    if (
      !name ||
      !mobile ||
      !email ||
      !address ||
      !city ||
      !pincode
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
          amount: totalAmount,
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
          const productNames = cart
            .map((item) => item.name)
            .join(", ");

          await fetch("/api/save-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_name: name,
              mobile,
              email,
              address,
              city,
              pincode,

              product_name: productNames,

              quantity: totalQty,

              amount: totalAmount,

              payment_status: "Paid",

              status: "Pending",

              razorpay_order_id: order.id,

              razorpay_payment_id:
                response.razorpay_payment_id,
            }),
          });

          await supabase
  .from("cart")
  .delete()
  .gt("id", 0);

          alert("✅ Payment Successful");

          router.push("/order-success");
        },

        prefill: {
          name,
          email,
          contact: mobile,
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

        <div style={{ marginTop: "8px" }}>
          <strong>{item.full_name}</strong>

          <p>{item.phone}</p>

          <p>
            {item.address_line1}{" "}
            {item.address_line2}
          </p>

          <p>
            {item.city}, {item.state} - {item.pincode}
          </p>
        </div>
      </label>
    ))}

    <button
      type="button"
      onClick={() => router.push("/addresses/new")}
      style={{
        marginTop: "10px",
        background: "#d4af37",
        color: "#000",
        border: "none",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      + Add New Address
    </button>
  </div>
)}
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />

              <textarea
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
              />

              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div
              style={{
                background: "#151515",
                padding: "25px",
                borderRadius: "15px",
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

              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>

                  <strong>
                    ₹{item.price * item.qty}
                  </strong>
                </div>
              ))}

              <hr
                style={{
                  margin: "20px 0",
                  borderColor: "#333",
                }}
              />

              <h3>Total Items: {totalQty}</h3>

              <h2
                style={{
                  color: "#d4af37",
                  marginTop: "10px",
                }}
              >
                Total: ₹{totalAmount}
              </h2>

              <button
                onClick={placeOrder}
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "25px",
                  background: "#d4af37",
                  color: "#000",
                  border: "none",
                  padding: "15px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Processing Payment..."
                  : "Continue To Payment"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}