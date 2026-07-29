import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/providers/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces — "paper" ledger concept
        paper: "#F3F4F1",
        "paper-dark": "#14171F",
        surface: "#FFFFFF",
        "surface-dark": "#1B1F2A",

        // Text
        ink: "#1F2430",
        "ink-dark": "#E7E6E1",
        muted: "#6B7080",
        "muted-dark": "#9498A6",

        // Rules / hairlines
        line: "#D8D6CC",
        "line-dark": "#2C3140",

        // Accents
        marigold: {
          DEFAULT: "#E8A33D",
          light: "#F0B45B",
        },
        ivy: {
          DEFAULT: "#3F6B52",
          light: "#6FA98A",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      maxWidth: {
        container: "1200px",
      },
      transitionTimingFunction: {
        ledger: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
