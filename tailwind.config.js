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

        textSub: "#9ca3af",
        textDescription: "#4b5563",
        textDisabled: "#999999",

        placeholderPrimary: "#fff",

        background: "#FFFFFF",

        borderInput: "#6b7280",
        borderSelect: "#e5e7eb",
        borderBottom: "#f3f4f6",
        borderCheckbox: "#d1d5db",
        selectActive: "#f0fdf4",
      },
    },
  },
  plugins: [],
};
