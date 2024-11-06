/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#10774A",
        buttonPrimary: "#10774A",
        buttonSecondary: "#4A90E2",
        buttonDisabled: "#D1D1D6",
        textPrimary: "#000000",
        textSecondary: "#666666",
        textDisabled: "#999999",
        background: "#FFFFFF",
        border: "#E5E5EA",
      },
    },
  },
  plugins: [],
};
