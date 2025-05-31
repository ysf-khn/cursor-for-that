import type { NextConfig } from "next";

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
