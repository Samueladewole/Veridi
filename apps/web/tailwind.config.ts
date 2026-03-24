import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#05080F",
        deep: "#080D18",
        panel: "#0C1220",
        panel2: "#0F1828",
        rail: "#152033",
        border: "#1A2840",
        border2: "#1F3050",
        teal: "#00D4B4",
        "teal-dim": "#00A88F",
        gold: "#F0A830",
        slate: "#94A3B8",
        slate2: "#64748B",
        slate3: "#334155",
        text: "#E8EEF6",
        text2: "#8FA8C8",
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        serif: ["'Instrument Serif'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
