import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#0a0e1a", 900: "#0f1526", 800: "#1a2340" },
        neon: { 400: "#22d3ee", 500: "#06b6d4" },
        volt: { 400: "#a3e635", 500: "#84cc16" }
      },
      fontFamily: { display: ["Inter", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};
export default config;

