import type { Config } from "tailwindcss";
import preset from "@run402/config/tailwind";

const config: Config = {
  presets: [preset],
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
export default config;
