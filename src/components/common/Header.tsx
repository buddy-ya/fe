import React, { ReactNode } from "react";
import { View, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";

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
    <ChevronLeft strokeWidth={2} size={30} color="#282828" />
  </TouchableOpacity>
);

export default function Header({
  leftContent,
  centerContent,
  rightContent,
  className = "",
  isSearchLayout = false,
}: HeaderProps) {
  if (isSearchLayout) {
    return (
      <View className={`px-[16px] h-[42px] flex-row items-center ${className}`}>
        <View className="mr-1">{leftContent}</View>
        <View className="flex-1">{centerContent}</View>
      </View>
    );
  }

  return (
    <View
      className={`px-[16px] h-11 flex-row items-center justify-between ${className}`}
    >
      <View className="flex-1">{leftContent}</View>
      <View className="flex-1 items-center">{centerContent}</View>
      <View className="flex-1 items-end">{rightContent}</View>
    </View>
  );
}
