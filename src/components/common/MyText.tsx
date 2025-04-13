import React from 'react';
import { Text, TextStyle } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface MyTextProps {
  children: React.ReactNode;
  size?: string;
  color?: string;
  numberOfLines?: number;
  className?: string;
  selectable?: boolean;
  onLongPress?: () => void;
}

const fontSizeMapping: { [key: string]: number } = {
  'text-xs': 12,
  'text-sm': 14,
  'text-base': 16,
  'text-lg': 18,
  'text-xl': 20,
  'text-2xl': 24,
  'text-3xl': 30,
  'text-4xl': 36,
  'text-5xl': 48,
  'text-6xl': 60,
  'text-7xl': 72,
  'text-8xl': 96,
  'text-9xl': 128,
};

const getFontSize = (size: string): number => {
  const customSizeMatch = size.match(/^text-\[(\d+(?:\.\d+)?)px\]$/);
  if (customSizeMatch) {
    return parseFloat(customSizeMatch[1]);
  }
  return fontSizeMapping[size] || fontSizeMapping['text-base'];
};

const MyText = ({
  children,
  size = 'text-base',
  color = 'text-[#282828]',
  numberOfLines,
  className = '',
  selectable = false,
  onLongPress,
}: MyTextProps) => {
  const baseSize = getFontSize(size);
  const responsiveFontSize = RFValue(baseSize) * 0.88;
  const textStyle: TextStyle = { fontSize: responsiveFontSize };

  return (
    <Text
      onLongPress={onLongPress}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={textStyle}
      className={`leading-[1.4] ${size} ${color} ${className}`}
      selectable={selectable}
    >
      {children}
    </Text>
  );
};

export default MyText;
