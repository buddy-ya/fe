import { ChevronRight, LucideIcon } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children?: ReactNode;
  type?: 'circle' | 'box';
  disabled?: boolean;
  color?: 'primary' | 'disabled';
  className?: string;
  icon?: LucideIcon;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function Button({
  onPress,
  children,
  type = 'box',
  disabled = false,
  className = '',
  icon: Icon = ChevronRight,
  iconSize = 32,
  iconColor = 'white',
  containerStyle,
}: ButtonProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'circle':
        return 'w-12 h-12 rounded-full items-center justify-center';
      case 'box':
        return 'w-full fixed bottom-6 py-5 rounded-[12px] items-center';
    }
  };

  const getColorStyles = (pressed: boolean) => {
    if (disabled) return 'bg-buttonDisabled';
    return pressed ? 'bg-active' : 'bg-primary';
  };

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <View
          className={` ${getTypeStyles()} ${getColorStyles(pressed)} ${className} `}
          style={containerStyle}
        >
          {type === 'circle' && <Icon strokeWidth={2} size={iconSize} color={iconColor} />}
          {children}
        </View>
      )}
    </Pressable>
  );
}
