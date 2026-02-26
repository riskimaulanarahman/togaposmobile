import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        card: "var(--card)",
        line: "var(--line)",
        accent: "var(--accent)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
      boxShadow: {
        glow: "0 10px 30px rgba(30, 77, 68, 0.16)",
      },
      borderRadius: {
        soft: "1rem",
        card: "1.25rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.35s ease-out",
        pulseSoft: "pulseSoft 1.6s ease-in-out infinite",
        slideUp: "slideUp 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
