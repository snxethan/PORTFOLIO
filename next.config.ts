/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'ethantownsend.dev' }],
        destination: '/social',
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ethantownsend.dev' }],
        destination: '/social',
      },
    ]
  },
};

export default nextConfig;