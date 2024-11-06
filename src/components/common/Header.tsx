import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

interface HeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({ onBack, showBackButton = true }: HeaderProps) {
  return (
    <View className="px-5 py-4 flex-row items-center">
      {showBackButton && (
        <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
          <Text className="text-base">뒤로</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
