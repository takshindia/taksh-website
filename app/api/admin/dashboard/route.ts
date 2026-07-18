import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [
      { count: productsCount, error: productsError },
      { count: categoriesCount, error: categoriesError },
      { data: ordersData, error: ordersError },
    ] = await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("*")
        .order("id", { ascending: false }),
    ]);

    if (productsError || categoriesError || ordersError) {
      return NextResponse.json(
        {
          error:
            productsError?.message ||
            categoriesError?.message ||
            ordersError?.message,
        },
        { status: 500 }
      );
    }

    const revenue = (ordersData || []).reduce((sum, order: any) => {
      return sum + Number(order.amount || 0);
    }, 0);

    return NextResponse.json({
      products: productsCount || 0,
      categories: categoriesCount || 0,
      orders: (ordersData || []).length,
      revenue,
      recentOrders: (ordersData || []).slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Dashboard query failed." },
      { status: 500 }
    );
  }
}
