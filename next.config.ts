import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
      },
      {
        protocol: 'https',
        hostname: 'infovallefertil.com',
      },
      {
        protocol: 'https',
        hostname: 'www.canela.gov.ar',
      },
    ],
  },
};

export default nextConfig;
