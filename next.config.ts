import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            }
        ],
        minimumCacheTTL: 60,
        unoptimized: true
    },
    experimental: {
        workerThreads: false,
        cpus: 1
    },
    productionBrowserSourceMaps: false,
    compress: true,
    poweredByHeader: false,
    generateBuildId: async () => 'build'
}

export default nextConfig
