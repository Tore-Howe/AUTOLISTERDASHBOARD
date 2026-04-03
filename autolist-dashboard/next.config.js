/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images2.autotrader.com' },
      { protocol: 'https', hostname: 'atcmedia.autos' },
    ],
  },
}

module.exports = nextConfig
