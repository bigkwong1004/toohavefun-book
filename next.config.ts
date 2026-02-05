import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/toohavefun-book',
  assetPrefix: '/toohavefun-book',
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
