/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ["@run402/ui"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};
export default nextConfig;
