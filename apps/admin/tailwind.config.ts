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
        },
        border: {
          DEFAULT: "#1A2840",
          2: "#243352",
        },
        amber: {
          DEFAULT: "#F59E0B",
          dim: "#B07008",
          pale: "rgba(245,158,11,0.08)",
          glow: "rgba(245,158,11,0.2)",
        },
        teal: "#00D4B4",
        gold: "#F0A830",
        red: {
          DEFAULT: "#EF4444",
          pale: "rgba(239,68,68,0.08)",
        },
        green: {
          DEFAULT: "#10B981",
          pale: "rgba(16,185,129,0.08)",
        },
        blue: {
          DEFAULT: "#3B82F6",
          pale: "rgba(59,130,246,0.08)",
        },
        purple: {
          DEFAULT: "#8B5CF6",
          pale: "rgba(139,92,246,0.08)",
        },
        text1: "#E2EAF4",
        text2: "#7A9AB8",
        slate: {
          DEFAULT: "#8BA3BE",
          2: "#5A7A96",
          3: "#3E5C78",
        },
        text3: "#2E4055",
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "feed-in": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s ease-in-out infinite",
        "blink-slow": "blink 2s ease-in-out infinite",
        "feed-in": "feed-in 0.25s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
