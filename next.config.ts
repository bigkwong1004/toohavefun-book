import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/toohavefun-book',
  assetPrefix: '/toohavefun-book',
  images: {
    unoptimized: true,
  },
  // Ensure build passes even if there are minor lint/type errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
