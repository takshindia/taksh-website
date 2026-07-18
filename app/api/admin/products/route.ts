import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [{ data: productsData, error: productsError }, { data: categoriesData, error: categoriesError }] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false }),
      supabase
        .from("categories")
        .select("*")
        .order("name"),
    ]);

    if (productsError || categoriesError) {
      return NextResponse.json(
        {
          error: productsError?.message || categoriesError?.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: productsData || [],
      categories: categoriesData || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Product query failed." },
      { status: 500 }
    );
  }
}
