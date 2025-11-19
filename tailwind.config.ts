import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        mono: ["Inconsolata", ...fontFamily.mono]
      },
      colors: {
        surface: "#0B1220",
        "surface-soft": "#111A2F",
        accent: {
          50: "#E0F2FF",
          100: "#BAE6FD",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7"
        }
      },
      boxShadow: {
        glow: "0 40px 90px rgba(14, 165, 233, 0.35)",
        "card-soft": "0 28px 60px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
} satisfies Config;
