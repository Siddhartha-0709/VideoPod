import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disables linting during the build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during the build
  },
};

export default nextConfig;
