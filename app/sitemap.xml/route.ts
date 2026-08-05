import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { encodeId } from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data } = await supabase.from("products").select("id, updated_at");

    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

    const urls = [
      "",
      "about",
      "products",
      "cart",
      "checkout",
      "contact",
      "privacy",
      "terms",
      "profile",
      "wishlist",
      "my-orders",
    ];

    const productUrls = (data || []).map((p: any) => ({
      loc: `${base}/products/${encodeId(p.id)}`,
      lastmod: p.updated_at || new Date().toISOString(),
    }));

    const all = [...urls.map((u) => ({ loc: `${base}/${u}` })), ...productUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (u: any) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: { "content-type": "application/xml" },
    });
  } catch (err) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/</loc>
  </url>
</urlset>`;

    return new NextResponse(xml, {
      headers: { "content-type": "application/xml" },
    });
  }
}
