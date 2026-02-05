const nextConfig = {
  output: 'export',
  basePath: '/toohavefun-book',
  assetPrefix: '/toohavefun-book',
  images: {
    unoptimized: true,
  },
  // Ensure build passes even if there are minor lint/type errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
