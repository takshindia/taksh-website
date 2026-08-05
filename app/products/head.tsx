import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function Head(): Promise<any> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  const meta: Metadata = {
    title: "Products | तक्ष (TAKSH)",
    description: "Browse our premium personalized products and gifts from तक्ष.",
    alternates: { canonical: `${base}/products` },
    openGraph: {
      title: "Products | तक्ष (TAKSH)",
      description: "Browse our premium personalized products and gifts from तक्ष.",
      url: `${base}/products`,
      images: [{ url: "/taksh-logo.png" }],
    },
  };

  return (
    <>
      <title>{meta.title as string}</title>
      <meta name="description" content={meta.description as string} />
      <link rel="canonical" href={(meta.alternates as any).canonical} />
      <meta property="og:title" content={meta.openGraph?.title as string} />
      <meta property="og:description" content={meta.openGraph?.description as string} />
      <meta property="og:url" content={meta.openGraph?.url as string} />
      <meta property="og:image" content="/taksh-logo.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
