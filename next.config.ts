import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yfqliewkwhfaqhwwriia.supabase.co",
      },
    ],
  },
};

export default nextConfig;