/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['images2.autotrader.com', 'atcmedia.autos'],
  },
}

module.exports = nextConfig
