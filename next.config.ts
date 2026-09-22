import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder project images (see src/content/projects.ts). Remove once real images are local.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
