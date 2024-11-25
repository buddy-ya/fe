module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#00A176",
        active: "#004D39",

        buttonPrimary: "#00A176",
        buttonDisabled: "#DFDFDF",

        text: "#282828",
        textDescription: "#797979",
        textWarning: "#FF7657",
        textLight: "#CBCBCB",

        placeholderPrimary: "#fff",
        background: "#FFFFFF",
        border: "#CBCBCB",
        borderInput: "#6b7280",
        borderSelect: "#e5e7eb",
        borderBottom: "#f3f4f6",
        borderCheckbox: "#d1d5db",
        borderFooter: "#E8E9EB",
        borderFeed: "#E8E9EB",
        footerBackground: "#FCFCFC",

        chipBorder: "#A6CFC4",
        chipActive: "#F6FFFD",

        modalBorderBottom: "#F6F6F6",

        iconBorder: "#797977",
        headerBottom: "#E8E9EB",
        selectActive: "#f0fdf4",
        mainBackground: "#F6F6F6",
      },
      fontFamily: {
        sans: ["Pretendard-Regular"],
        thin: ["Pretendard-Thin"],
        extralight: ["Pretendard-ExtraLight"],
        light: ["Pretendard-Light"],
        medium: ["Pretendard-Medium"],
        semibold: ["Pretendard-SemiBold"],
        bold: ["Pretendard-Bold"],
        extrabold: ["Pretendard-ExtraBold"],
        black: ["Pretendard-Black"],
      },
      fontWeight: {
        thin: undefined,
        extralight: undefined,
        light: undefined,
        normal: undefined,
        medium: undefined,
        semibold: undefined,
        bold: undefined,
        extrabold: undefined,
        black: undefined,
      },
      lineHeight: {
        none: "1",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".text": { color: "#282828" },
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
