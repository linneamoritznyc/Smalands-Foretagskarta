import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        sky: {
          light: "#A8D8EA",
          DEFAULT: "#A8D8EA",
        },
        silver: {
          DEFAULT: "#C0C0C0",
        },
        // Accent colors
        mint: "#B8E6D5",
        lavender: "#D4C5F9",
        peach: "#FFD4B8",
        rose: "#FFB3C1",
        "soft-yellow": "#FFF3B8",
        // Text colors
        charcoal: "#1F2937",
        "medium-gray": "#6B7280",
        "light-gray": "#9CA3AF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Roboto Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.05)",
        "glass-hover": "0 12px 48px rgba(0, 0, 0, 0.08)",
      },
      backdropBlur: {
        glass: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
