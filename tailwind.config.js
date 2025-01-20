module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      textColor: {
        DEFAULT: '#282828',
      },
      colors: {
        primary: '#00A176',
        active: '#004D39',
        natural: '#F1F1F1',

        buttonPrimary: '#00A176',
        buttonDisabled: '#DFDFDF',

        text: '#282828',
        textDescription: '#797979',
        textWarning: '#FF7657',
        textLight: '#CBCBCB',
        textProfile: '#474747',

        placeholderPrimary: '#fff',
        background: '#FFFFFF',
        border: '#CBCBCB',
        borderInput: '#6b7280',
        borderSelect: '#e5e7eb',
        borderBottom: '#f3f4f6',
        borderCheckbox: '#d1d5db',
        borderFooter: '#E8E9EB',
        borderFeed: '#E8E9EB',
        footerBackground: '#FCFCFC',

        chipBorder: '#A6CFC4',
        chipActive: '#F6FFFD',

        modalBorderBottom: '#F6F6F6',

        iconBorder: '#797977',
        headerBottom: '#E8E9EB',
        selectActive: '#f0fdf4',

        mainBackground: '#F6F6F6',
      },
      fontFamily: {
        sans: ['Pretendard-Regular'],
        thin: ['Pretendard-Thin'],
        extralight: ['Pretendard-ExtraLight'],
        light: ['Pretendard-Light'],
        medium: ['Pretendard-Medium'],
        semibold: ['Pretendard-SemiBold'],
        bold: ['Pretendard-Bold'],
        extrabold: ['Pretendard-ExtraBold'],
        black: ['Pretendard-Black'],
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
        none: '1',
      },
    },
  },
};
