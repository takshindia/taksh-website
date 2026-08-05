import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, customer_name, rating, review, email } = body;

    if (!product_id || !customer_name || !review) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    // Check that the customer actually ordered this product (best-effort)
    if (!email) {
      return NextResponse.json({ ok: false, error: "User must be logged in to submit review" }, { status: 403 });
    }

    // Verify product exists and get its name
    const { data: prodData } = await supabase.from("products").select("name").eq("id", product_id).limit(1).single();
    const productName = prodData?.name || "";

    const { data: orders } = await supabase
      .from("orders")
      .select("id, product_name, payment_status, status")
      .eq("email", email)
      .limit(20);

    const purchased = (orders || []).some((o: any) => {
      const productNames = String(o.product_name || "").toLowerCase();
      const matchesProduct = productNames.includes(String(productName).toLowerCase()) || productNames.includes(String(product_id).toLowerCase());
      const paid = (String(o.payment_status || "").toLowerCase() === "paid");
      const notPending = String(o.status || "").toLowerCase() !== "pending" && String(o.status || "").toLowerCase() !== "cancelled";
      return matchesProduct && paid && notPending;
    });

    if (!purchased) {
      return NextResponse.json({ ok: false, error: "No eligible purchase found for this product" }, { status: 403 });
    }

    // prevent duplicate reviews from same email for same product
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", product_id)
      .ilike("customer_name", customer_name)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ ok: false, error: "Review already submitted" }, { status: 200 });
    }

    const { error } = await supabase.from("reviews").insert([
      {
        product_id,
        customer_name,
        rating: Number(rating || 5),
        review,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
