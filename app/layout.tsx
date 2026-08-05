import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "तक्ष (TAKSH) | Premium Laser Engraving & Personalized Gifts",
  description:
    "Custom laser engraving, wooden gifts, metal engraving, jewellery customization and personalized gifts by तक्ष.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "तक्ष (TAKSH) | Premium Laser Engraving & Personalized Gifts",
    description:
      "Custom laser engraving, wooden gifts, metal engraving, jewellery customization and personalized gifts by तक्ष.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    siteName: "तक्ष (TAKSH)",
    images: [
      {
        url: "/taksh-logo.png",
        width: 800,
        height: 600,
        alt: "तक्ष (TAKSH) Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "तक्ष (TAKSH)",
    description:
      "Custom laser engraving and personalized gifts from तक्ष.",
    images: ["/taksh-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  {children}

  <Script src="https://checkout.razorpay.com/v1/checkout.js" />
</body>
    </html>
  );
}