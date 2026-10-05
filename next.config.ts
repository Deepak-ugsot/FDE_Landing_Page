import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Files served straight out of public/ carry no content hash, so Next.js leaves them
        // uncacheable (max-age=0, must-revalidate) and every repeat visit re-fetches the
        // background video. Cache them hard instead — but that means an asset edited in place
        // keeps serving stale for a year, so give changed assets a new filename.
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
