import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const unique = new Map();

    (data || []).forEach((order: any) => {
      if (!unique.has(order.mobile)) {
        unique.set(order.mobile, {
          name: order.customer_name,
          mobile: order.mobile,
          city: order.city,
          address: order.address,
          orders: 1,
          total: Number(order.amount || 0),
        });
      } else {
        const customer = unique.get(order.mobile);
        customer.orders += 1;
        customer.total += Number(order.amount || 0);
      }
    });

    return NextResponse.json({
      customers: Array.from(unique.values()),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Customers query failed." },
      { status: 500 }
    );
  }
}
