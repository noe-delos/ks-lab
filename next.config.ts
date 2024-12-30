import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      headers: [{ key: "Cache-Control", value: "no-store" }],
    },
  ],
  /* config options here */
};

export default nextConfig;
