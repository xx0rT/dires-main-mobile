import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            }
        ]
    },
    experimental: {
        workerThreads: false,
        cpus: 1
    },
    productionBrowserSourceMaps: false
}

export default nextConfig
