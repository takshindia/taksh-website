import Link from "next/link";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/track?id=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1>Order not found.</h1>
      </div>
    );
  }

  const order = await res.json();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-yellow-500/20 bg-[#111] p-8">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Order Details</h1>

        <p>
          <span className="font-semibold">Order ID:</span> {order.id}
        </p>

        <p>
          <span className="font-semibold">Customer:</span> {order.customer_name}
        </p>

        <p>
          <span className="font-semibold">Product:</span> {order.product_name}
        </p>

        <p>
          <span className="font-semibold">Quantity:</span> {order.quantity}
        </p>

        <p>
          <span className="font-semibold">Amount:</span> ₹{order.amount}
        </p>

        <p>
          <span className="font-semibold">Payment Status:</span> {order.payment_status}
        </p>

        <p>
          <span className="font-semibold">Order Status:</span> {order.status}
        </p>

        <hr className="my-6 border-gray-700" />

        <h2 className="text-yellow-400 font-semibold mb-2">Shipping Details</h2>

        <p>
          <span className="font-semibold">Status:</span> {order.tracking_status || order.status}
        </p>

        <p>
          <span className="font-semibold">Courier:</span> {order.courier_name || "-"}
        </p>

        <p>
          <span className="font-semibold">AWB:</span> {order.awb_code || "-"}
        </p>

        {order.tracking_url && (
          <a
            href={order.tracking_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 rounded-xl bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400"
          >
            Track Shipment
          </a>
        )}

        <div className="mt-6">
          <Link href="/my-orders" className="text-yellow-400 font-semibold">
            ← Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
