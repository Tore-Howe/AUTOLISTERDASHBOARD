/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingExcludes: {
      '*': ['**/@swc/core*', '**/esbuild*'],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images2.autotrader.com' },
    ],
  },
}

module.exports = nextConfig
