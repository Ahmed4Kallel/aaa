/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix for cross-origin warning
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
  ],
}

export default nextConfig
