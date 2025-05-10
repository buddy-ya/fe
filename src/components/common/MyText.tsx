import React from 'react';
import { Text, TextStyle, Dimensions, PixelRatio } from 'react-native';

interface MyTextProps {
  children: React.ReactNode;
  size?: string;
  color?: string;
  numberOfLines?: number;
  className?: string;
  selectable?: boolean;
  onLongPress?: () => void;
  extraScale?: number;
}

const fontSizeMapping: Record<string, number> = {
  'text-xs': 10,
  'text-sm': 12.4,
  'text-base': 14.2,
  'text-lg': 16,
  'text-xl': 18,
  'text-2xl': 21,
  'text-3xl': 26,
  'text-4xl': 32,
  'text-5xl': 42,
  'text-6xl': 52,
  'text-7xl': 63,
  'text-8xl': 84,
  'text-9xl': 112,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_BASE_WIDTH = 375;
const rawScale = SCREEN_WIDTH / DESIGN_BASE_WIDTH;
const WIDTH_SCALE = Math.min(Math.max(rawScale, 0.9), 1.2);

export default function MyText({
  children,
  size = 'text-base',
  color = 'text-[#282828]',
  numberOfLines,
  className = '',
  selectable = false,
  onLongPress,
  extraScale = 1.0,
}: MyTextProps) {
  const bracket = size.match(/^text-\[(\d+)px\]$/);
  const base = bracket
    ? parseInt(bracket[1], 10)
    : (fontSizeMapping[size] ?? fontSizeMapping['text-base']);

  const raw = base * WIDTH_SCALE * extraScale;
  const fontSize = PixelRatio.roundToNearestPixel(raw);
  const lineHeight = fontSize * 1.4; // 140% 고정

  return (
    <Text
      allowFontScaling={false}
      onLongPress={onLongPress}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={{ fontSize, lineHeight } as TextStyle}
      className={`${className} ${color}`}
      selectable={selectable}
    >
      {children}
    </Text>
  );
}
