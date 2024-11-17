/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#00A176",

        buttonPrimary: "#10774A",
        buttonSecondary: "#4A90E2",
        buttonDisabled: "#D1D1D6",

        text: "#282828",
        textSub: "#797979",
        textDescription: "#4b5563",
        textDisabled: "#DFDFDF",

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
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".text-xs": { color: "#282828" },
        ".text-sm": { color: "#282828" },
        ".text-base": { color: "#282828" },
        ".text-lg": { color: "#282828" },
        ".text-xl": { color: "#282828" },
        ".text-2xl": { color: "#282828" },
        ".text-3xl": { color: "#282828" },
        ".text-4xl": { color: "#282828" },
      });
    },
  ],
};
