import Link from "next/link";
import { headers } from "next/headers";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TrackPage({ params }: Props) {
  const { id } = await params;

  const host = (await headers()).get("host");

const protocol =
  host?.includes("localhost") ? "http" : "https";

const res = await fetch(
  `${protocol}://${host}/api/track?id=${id}`,
  {
    cache: "no-store",
  }
);

  if (!res.ok) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0d0d0d",
          color: "white",
        }}
      >
        <h1>Order not found.</h1>
      </div>
    );
  }

  const order = await res.json();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "white",
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#181818",
          border: "2px solid #d4af37",
          borderRadius: "16px",
          padding: "30px",
        }}
      >
        <h1
          style={{
            color: "#d4af37",
            marginBottom: "30px",
          }}
        >
          📦 Track Your Order
        </h1>

        <p>
          <b>Order ID:</b> {order.id}
        </p>

        <p>
          <b>Customer:</b> {order.customer_name}
        </p>

        <p>
          <b>Product:</b> {order.product_name}
        </p>

        <p>
          <b>Quantity:</b> {order.quantity}
        </p>

        <p>
          <b>Amount:</b> ₹{order.amount}
        </p>

        <hr
          style={{
            margin: "25px 0",
            borderColor: "#444",
          }}
        />
        <h2
          style={{
            color: "#d4af37",
            marginTop: "20px",
            marginBottom: "15px",
          }}
        >
          🚚 Shipping Details
        </h2>

        <p>
          <b>Status:</b>{" "}
          {order.tracking_status || order.status}
        </p>

        <p>
          <b>Courier:</b>{" "}
          {order.courier_name || "-"}
        </p>

        <p>
          <b>AWB:</b>{" "}
          {order.awb_code || "-"}
        </p>

        {order.tracking_url && (
          <a
            href={order.tracking_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "20px",
              background: "#d4af37",
              color: "#000",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            🚚 Track Shipment
          </a>
        )}

        <br />
        <br />

        <Link
          href="/"
          style={{
            color: "#d4af37",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}