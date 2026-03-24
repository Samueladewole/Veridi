import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#05080F",
        panel: "#0C1220",
        amber: "#F59E0B",
        border: "#1A2840",
        "text-primary": "#E2EAF4",
        "text-secondary": "#7A9AB8",
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
