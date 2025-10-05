/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: 'my-value',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/:path*`,
      },
    ];
  },
  output: 'standalone', // For Docker production builds
};

module.exports = nextConfig;
