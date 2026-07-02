import type { Config } from "tailwindcss";
import preset from "@run402/config/tailwind";

const config: Config = {
  presets: [preset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    // Include the shared UI package so its class names are not purged.
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
