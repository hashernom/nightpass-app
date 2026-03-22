/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nightpass/types', '@nightpass/zod-schemas'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
