import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ChipProps {
  icon?: string;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export function Chip({ icon, label, selected, onPress, className }: ChipProps) {
  return (
    <TouchableOpacity onPress={onPress} className="mb-[0.5px]">
      <View
        className={`flex-row items-center px-4 py-2 rounded-full border
          ${selected ? "border-primary bg-chipActive" : "border-border"}
          ${className || ""}`}
      >
        {icon && <Text className="mr-2">{icon}</Text>}
        <Text
          className={`text-sm ${
            selected ? "text-active" : "text-textDescription"
          }`}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
