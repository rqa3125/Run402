import { FlatCompat } from "@eslint/eslintrc";
import { baseConfig } from "./base.mjs";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * Shared ESLint config for Next.js apps. Composes the base config with
 * `eslint-config-next` via FlatCompat until Next ships a native flat config.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextConfig = [
  ...baseConfig,
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default nextConfig;
