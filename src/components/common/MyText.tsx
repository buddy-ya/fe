import React from 'react';
import { Text, TextStyle, Dimensions } from 'react-native';
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

const fontSizeMapping: Record<string, number> = {
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const THRESHOLD = 926;
const SMALL_MULT = 0.88;
const LARGE_MULT = 0.8;

function getBaseSize(size: string) {
  const m = size.match(/^text-\[(\d+(?:\.\d+)?)px\]$/);
  return m ? parseFloat(m[1]) : (fontSizeMapping[size] ?? fontSizeMapping['text-base']);
}

export default function MyText({
  children,
  size = 'text-base',
  color = 'text-[#282828]',
  numberOfLines,
  className = '',
  selectable = false,
  onLongPress,
}: MyTextProps) {
  const base = getBaseSize(size);

  // 화면 높이 기준으로 multiplier 선택
  const mult = SCREEN_HEIGHT > THRESHOLD ? LARGE_MULT : SMALL_MULT;
  const fontSize = Math.round(RFValue(base) * mult);

  const style: TextStyle = { fontSize };

  return (
    <Text
      allowFontScaling={false}
      onLongPress={onLongPress}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      style={style}
      className={`leading-[1.4] ${size} ${color} ${className}`}
      selectable={selectable}
    >
      {children}
    </Text>
  );
}
