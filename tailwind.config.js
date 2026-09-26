/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        graphite: "#0F1117",
        panel: "#1A1D24",
        border: "#2A2E39",
        neon: "#8B5CF6",
        cyan: "#06B6D4",
        muted: "#9CA3AF",
      },
    },
  },
  plugins: [],
};
