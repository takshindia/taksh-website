import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body.code || "").trim().toLowerCase();

    if (!code) {
      return NextResponse.json({ ok: false, error: "Coupon code required" }, { status: 400 });
    }

    const { data, error } = await supabase.from("offers").select("*").ilike("coupon_code", code).limit(1);

    if (error) {
      // fallback to admin file if table missing
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const raw = await fs.readFile(path.join(process.cwd(), "data", "admin-offers.json"), "utf8");
        const offers = JSON.parse(raw || "[]");
        const found = offers.find((o: any) => String(o.coupon_code || "").toLowerCase() === code);
        if (!found) return NextResponse.json({ ok: false, error: "Invalid coupon" }, { status: 200 });
        return NextResponse.json({ ok: true, coupon: found });
      } catch (e) {
        return NextResponse.json({ ok: false, error: "Coupon lookup failed" }, { status: 500 });
      }
    }

    const offer = (data || [])[0];

    if (!offer) {
      return NextResponse.json({ ok: false, error: "Invalid coupon" }, { status: 200 });
    }

    const today = new Date().toISOString().slice(0, 10);
    if (offer.status !== "active" || offer.start_date > today || offer.end_date < today) {
      return NextResponse.json({ ok: false, error: "Coupon not active" }, { status: 200 });
    }

    return NextResponse.json({ ok: true, coupon: offer });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
