import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08080b",
          900: "#0c0c11",
          800: "#13131b",
          700: "#1c1c27",
          600: "#262635",
          500: "#3a3a4f",
          400: "#5b5b75",
          300: "#8a8aa3",
          200: "#b8b8cc",
          100: "#e6e6f0",
        },
        accent: {
          DEFAULT: "#7c5cff",
          hover: "#9078ff",
          soft: "#7c5cff22",
        },
        success: "#3ddc97",
        danger: "#ff6b6b",
        warn: "#ffb454",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "pulse-soft": "pulseSoft 1.6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
