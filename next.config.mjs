/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Next's dev server refuses cross-origin requests to its dev resources
  // (/_next/webpack-hmr) unless the requesting host is listed here. When that
  // request is blocked the dev client never boots, so the page stays
  // server-rendered only: no entrance or reveal animations, and every
  // framer-motion `initial` block stays at opacity 0 (invisible hero, invisible
  // project cards). Required for the ngrok tunnel and for reaching the dev
  // server from another device on the LAN.
  allowedDevOrigins: [
    '*.ngrok-free.dev',
    '*.ngrok-free.app',
    '192.168.160.1',
    '127.0.0.1',
  ],
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
