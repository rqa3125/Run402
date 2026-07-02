/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Linting runs as a dedicated Turborepo task (`turbo run lint`) using the
  // shared flat ESLint config, so we skip Next's legacy build-time linter.
  eslint: { ignoreDuringBuilds: true },
  // Transpile workspace packages that ship raw TypeScript/TSX.
  transpilePackages: [
    "@run402/ui",
    "@run402/database",
    "@run402/env",
    "@run402/logging",
    "@run402/utils",
    "@run402/payments",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
