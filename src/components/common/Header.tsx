import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { ChevronLeft } from "lucide-react-native";

interface HeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({ onBack, showBackButton = true }: HeaderProps) {
  return (
    <View className="px-4 h-14 flex-row items-center border-b-[0.3px] border-b-headerBottom">
      {showBackButton && (
        <TouchableOpacity onPress={onBack} className="flex-row items-center">
          <ChevronLeft strokeWidth={2} size={24} color={"black"} />
          <Text className="text-lg">뒤로</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
