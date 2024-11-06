import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

interface HeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({ onBack, showBackButton = true }: HeaderProps) {
  return (
    <View className="px-6 py-4 flex-row items-center">
      {showBackButton && (
        <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
          <Text className="text-lg">뒤로</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
