/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Allow an isolated build output dir so a production build can run for
  // measurement without disturbing a running dev server's .next directory.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
