import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f6f7",
          100: "#e4e9eb",
          200: "#c7d1d6",
          300: "#9fb0b8",
          400: "#6d8590",
          500: "#4c6874",
          600: "#3c525c",
          700: "#33444d",
          800: "#2c3941",
          900: "#1a2226",
          950: "#0f1417",
        },
        brass: {
          50: "#fbf6ec",
          100: "#f5e8cc",
          200: "#eacea0",
          300: "#ddac68",
          400: "#cf8f42",
          500: "#b8752e",
          600: "#975c25",
          700: "#794622",
          800: "#643a20",
          900: "#54311e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 20, 23, 0.06), 0 8px 24px -12px rgba(15, 20, 23, 0.18)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        confetti: {
          "0%": { transform: "translateY(-8px) rotate(0deg)", opacity: "0" },
          "15%": { opacity: "1" },
          "100%": { transform: "translateY(40px) rotate(180deg)", opacity: "0" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pop-in": "pop-in 0.4s ease-out both",
        confetti: "confetti 1.8s ease-in infinite",
      },
    },
  },
  plugins: [],
};

export default config;
