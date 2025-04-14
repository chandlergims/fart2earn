/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable strict mode for React
  reactStrictMode: false,
  // Configure image domains for Firebase Storage
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'audio-f12b2.firebasestorage.app'
    ],
  },
};

module.exports = nextConfig;
