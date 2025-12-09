/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'portfoliyou.snxethan.dev',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'scheduleit.snxethan.dev',
        port: '',
        pathname: '/**',
      },
    ],
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