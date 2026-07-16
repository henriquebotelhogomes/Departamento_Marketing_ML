import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        segment: {
          active: "#2563EB",
          revolver: "#EA580C",
          advance: "#DC2626",
          payer: "#16A34A",
          fallback: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};

export default config;