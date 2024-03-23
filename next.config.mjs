/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    eslint: {
      // This will ignore ESLint errors during the production build
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;
  