import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function normalizeProductPayload(body: Record<string, any>) {
  return {
    name: String(body.name || "").trim(),
    slug: String(body.slug || "").trim(),
    description: String(body.description || "").trim(),
    price: Number(body.price || 0),
    discount_price:
      body.discount_price === "" || body.discount_price == null
        ? null
        : Number(body.discount_price),
    sku: String(body.sku || "").trim(),
    stock: Number(body.stock || 0),
    category_id:
      body.category_id === "" || body.category_id == null
        ? null
        : Number(body.category_id),
    featured: body.featured === true || body.featured === "true",
    image_url: body.image_url || null,
    image_urls: Array.isArray(body.image_urls) ? body.image_urls : [],
  };
}

async function uploadFiles(files: File[]) {
  const urls: string[] = [];

  for (const file of files) {
    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("Products")
      .upload(fileName, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("Products")
      .getPublicUrl(fileName);

    urls.push(publicUrlData.publicUrl);
  }

  return urls;
}

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

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload: Record<string, any> = {};
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      files = Array.from(formData.getAll("files")).filter((item): item is File => item instanceof File);
      payload = Object.fromEntries(formData.entries());
    } else {
      payload = await request.json();
    }

    const uploadedUrls = await uploadFiles(files);
    const productPayload = normalizeProductPayload(payload);

    if (uploadedUrls.length > 0) {
      productPayload.image_url = uploadedUrls[0];
      productPayload.image_urls = uploadedUrls;
    }

    const { error } = await supabase.from("products").insert([productPayload]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Product create failed." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload: Record<string, any> = {};
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      files = Array.from(formData.getAll("files")).filter((item): item is File => item instanceof File);
      payload = Object.fromEntries(formData.entries());
    } else {
      payload = await request.json();
    }

    const uploadedUrls = await uploadFiles(files);
    const productPayload = normalizeProductPayload(payload);

    if (uploadedUrls.length > 0) {
      productPayload.image_url = uploadedUrls[0];
      productPayload.image_urls = uploadedUrls;
    }

    const { error } = await supabase
      .from("products")
      .update(productPayload)
      .eq("id", Number(payload.id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Product update failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Product delete failed." },
      { status: 500 }
    );
  }
}
