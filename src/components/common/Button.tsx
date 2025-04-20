import { ReactNode } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ChevronRight, LucideIcon, LoaderCircle, icons } from 'lucide-react-native';

// CSS 파일 불러오기

interface ButtonProps {
  onPress: () => void;
  children?: ReactNode;
  type?: 'circle' | 'box';
  loading?: boolean;
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
  loading = false,
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
        return 'w-full fixed bottom-5 py-5 rounded-[12px] items-center';
    }
  };

  const getColorStyles = () => {
    if (disabled) return 'bg-buttonDisabled';
    return 'bg-primary active:bg-active';
  };

  if (loading)
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={true}
        className={`${getTypeStyles()} bg-primary active:bg-active ${className}`}
        style={containerStyle}
        activeOpacity={0.9}
      >
        <View className="flex animate-spin">
          <LoaderCircle strokeWidth={2} size={26} color={iconColor} />
        </View>
      </TouchableOpacity>
    );
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${getTypeStyles()} ${getColorStyles()} ${className}`}
      style={containerStyle}
      activeOpacity={0.9}
    >
      {type === 'circle' && <Icon strokeWidth={2} size={iconSize} color={iconColor} />}
      {children}
    </TouchableOpacity>
  );
}
