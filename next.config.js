/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
     webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallback untuk Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
      
      // Mock process untuk browser
      config.resolve.alias = {
        ...config.resolve.alias,
        process: 'process/browser',
      };
    }
    
    return config;
  },
  experimental: {
    optimizePackageImports: ['@story-protocol/core-sdk'],
  },
}

module.exports = nextConfig
