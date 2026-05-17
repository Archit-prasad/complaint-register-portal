import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.22.208.1'],
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
}

export default nextConfig
