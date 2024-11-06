import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { ChevronLeft } from "lucide-react-native";

interface HeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({ onBack, showBackButton = true }: HeaderProps) {
  return (
    <View className="px-0 py-4 flex-row items-center">
      {showBackButton && (
        <TouchableOpacity
          onPress={onBack}
          className="ml-2 flex-row items-center"
        >
          <ChevronLeft size={32} color="#000000" />
          <Text className="text-xl">뒤로</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
