/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#10774A",
        white: "#FFFFFF",
        black: "#000000",
      },
    },
  },
  plugins: [],
};
