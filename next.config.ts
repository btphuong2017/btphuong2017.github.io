import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emits vi/index.html: GitHub Pages then serves /vi/ and redirects /vi to it.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Each locale needs its own root layout for a static <html lang>, so there is
  // no single root layout for the 404 page to live in.
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
