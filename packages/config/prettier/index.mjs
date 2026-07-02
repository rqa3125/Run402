/**
 * Shared Prettier config. The Tailwind plugin keeps class lists in a
 * canonical order across every app and package.
 *
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  tabWidth: 2,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["cn", "cva", "clsx"],
};

export default config;
