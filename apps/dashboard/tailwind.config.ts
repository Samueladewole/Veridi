import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        void: "#05080F",
        deep: "#070D18",
        panel: {
          DEFAULT: "#0C1220",
          2: "#111827",
          3: "#111E30",
        },
        rail: "#152033",
        border: {
          DEFAULT: "#1A2840",
          2: "#243352",
        },
        teal: {
          DEFAULT: "#00D4B4",
          dim: "#009E87",
          pale: "rgba(0,212,180,0.08)",
          glow: "rgba(0,212,180,0.2)",
        },
        gold: {
          DEFAULT: "#F0A830",
          pale: "rgba(240,168,48,0.08)",
        },
        red: {
          DEFAULT: "#F04040",
          pale: "rgba(240,64,64,0.08)",
        },
        green: {
          DEFAULT: "#22C55E",
          pale: "rgba(34,197,94,0.08)",
        },
        blue: {
          DEFAULT: "#3B82F6",
        },
        purple: {
          DEFAULT: "#8B5CF6",
        },
        pink: "#EC4899",
        text: {
          1: "#E2EAF4",
          2: "#7A9AB8",
          3: "#334766",
        },
        slate: {
          DEFAULT: "#8BA3BE",
          2: "#5A7A96",
          3: "#3E5C78",
        },
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
