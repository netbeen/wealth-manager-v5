/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  compress: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  experimental: {
    typedRoutes: false,
    esmExternals: 'loose',
  },
}

module.exports = nextConfig
