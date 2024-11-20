import React from "react";
import { TouchableOpacity, View } from "react-native";
import MyText from "@/components/common/MyText";

interface ChipProps {
  icon?: string;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export function Chip({ icon, label, selected, onPress, className }: ChipProps) {
  return (
    <TouchableOpacity onPress={onPress} className="mb-[0.3px]">
      <View
        className={`flex-row items-center px-4 py-2 rounded-full border
          ${selected ? "border-primary bg-chipActive" : "border-border"}
          ${className || ""}`}
      >
        {icon && <MyText className="mr-2">{icon}</MyText>}
        <MyText
          size="text-sm"
          color={selected ? "text-active" : "text-textDescription"}
        >
          {label}
        </MyText>
      </View>
    </TouchableOpacity>
  );
}
