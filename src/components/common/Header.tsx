import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { ChevronLeft } from "lucide-react-native";

interface HeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({ onBack, showBackButton = true }: HeaderProps) {
  return (
    <View className="px-4 py-4 flex-row items-center">
      {showBackButton && (
        <TouchableOpacity onPress={onBack} className="flex-row items-center">
          <ChevronLeft strokeWidth={2} size={24} color={"black"} />
          <Text className="text-xl">뒤로</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
