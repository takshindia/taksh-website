import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { decodeId } from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function Head({ params }: any): Promise<any> {
  const id = params?.id;
  let product: any = null;

  try {
    const internalId = decodeId(id as string);
    const { data } = await supabase.from("products").select("*").eq("id", Number(internalId)).single();
    product = data;
  } catch (err) {
    // ignore
  }

  const title = product ? `${product.name} | तक्ष (TAKSH)` : "Product | तक्ष (TAKSH)";
  const description = product?.description || "Premium personalized product from तक्ष.";
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/products/${id}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={product?.image_url || "/taksh-logo.png"} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
