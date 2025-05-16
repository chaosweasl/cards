import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Improve tree-shaking by optimizing imports from these packages
  experimental: {
    optimizePackageImports: ["react-icons"],
  },

  // Add server component settings
  compiler: {
    // Remove console logs from production build
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Add custom headers for better security
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Improve image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "deckofcardsapi.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
