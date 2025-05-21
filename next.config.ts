import type { NextConfig } from "next";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

if (!API_HOST) {
  throw new Error("Missing NEXT_PUBLIC_API_HOST in environment variables");
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_HOST}/:path*`,
      },
    ];
  },
  webpack: config => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;