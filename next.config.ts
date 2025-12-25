import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.autonomous.ai",
      },
      {
        protocol: "https",
        hostname: "www.phonearena.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect www to non-www (except sitemap and robots)
      {
        source: '/:path((?!sitemap\\.xml|feed\\.xml|robots\\.txt).*)',
        has: [
          {
            type: 'host',
            value: 'www.aanaa.blog',
          },
        ],
        destination: 'https://aanaa.blog/:path*',
        permanent: true,
      },
      // Category page redirect
      {
        source: '/category',
        destination: '/category/',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
