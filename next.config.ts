import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/toohavefun-book',
  assetPrefix: '/toohavefun-book',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
