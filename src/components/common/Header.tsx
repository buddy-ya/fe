import { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface HeaderProps {
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  isSearchLayout?: boolean;
}

export const BackButton = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className="relative right-2 flex-row items-center"
    hitSlop={{ right: 20 }}
  >
    <ChevronLeft strokeWidth={2} size={28} color="#797979" />
  </TouchableOpacity>
);

export default function Header({
  leftContent,
  centerContent,
  rightContent,
  className = '',
  isSearchLayout = false,
}: HeaderProps) {
  if (isSearchLayout) {
    return (
      <View className={`h-[42px] flex-row items-center px-[16px] ${className}`}>
        <View className="mr-1">{leftContent}</View>
        <View className="flex-1">{centerContent}</View>
      </View>
    );
  }

  return (
    <View className={`flex-row items-center justify-between px-[16px] py-[12px] ${className} `}>
      <View className="flex-1">{leftContent}</View>
      <View className="flex-1 items-center">{centerContent}</View>
      <View className="flex-1 items-end">{rightContent}</View>
    </View>
  );
}
