import React from 'react';
import { Text, TextStyle } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface MyTextProps {
  children: React.ReactNode;
  size?: string; // 예: "text-base", "text-lg", 혹은 "text-[13px]"
  color?: string;
  numberOfLines?: number;
  className?: string;
}

// Tailwind CSS의 폰트 사이즈 기준을 픽셀 단위로 명시
const fontSizeMapping: { [key: string]: number } = {
  'text-xs': 12, // 0.75rem -> 12px
  'text-sm': 14, // 0.875rem -> 14px
  'text-base': 16, // 1rem -> 16px
  'text-lg': 18, // 1.125rem -> 18px
  'text-xl': 20, // 1.25rem -> 20px
  'text-2xl': 24, // 1.5rem -> 24px
  'text-3xl': 30, // 1.875rem -> 30px
  'text-4xl': 36, // 2.25rem -> 36px
  'text-5xl': 48, // 3rem -> 48px
  'text-6xl': 60, // 3.75rem -> 60px
  'text-7xl': 72, // 4.5rem -> 72px
  'text-8xl': 96, // 6rem -> 96px
  'text-9xl': 128, // 8rem -> 128px
};

const getFontSize = (size: string): number => {
  // "text-[13px]" 같이 커스텀 값 처리
  const customSizeMatch = size.match(/^text-\[(\d+(?:\.\d+)?)px\]$/);
  if (customSizeMatch) {
    return parseFloat(customSizeMatch[1]);
  }
  // 매핑에 값이 없으면 기본값 "text-base"로 처리
  return fontSizeMapping[size] || fontSizeMapping['text-base'];
};

const MyText = ({
  children,
  size = 'text-base',
  color = 'text-[#282828]',
  numberOfLines,
  className = '',
}: MyTextProps) => {
  const baseSize = getFontSize(size);
  const responsiveFontSize = RFValue(baseSize) * 0.88;
  const textStyle: TextStyle = { fontSize: responsiveFontSize };

  return (
    <Text
      className={`leading-[1.4] ${size} ${color} ${className}`}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={textStyle}
    >
      {children}
    </Text>
  );
};

export default MyText;
