import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "openweathermap.org",
    ]
  }
};

export default nextConfig;
