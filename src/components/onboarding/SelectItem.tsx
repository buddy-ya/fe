import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Check } from "lucide-react-native";
import MyText from "../common/MyText";

interface SelectItemProps {
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  item?: string;
  children?: React.ReactNode;
}

export default function SelectItem({
  selected,
  disabled,
  onPress,
  item,
  children,
}: SelectItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
        w-[262px] h-[52px] flex-row items-center px-4 py-4 border rounded-xl mb-3
       ${
         selected
           ? "bg-chipActive border-[1px] border-primary"
           : "border-border"
       }
     `}
    >
      <MyText size="text-base" color={selected ? "text-active" : undefined}>
        {item}
      </MyText>
      {children}
    </TouchableOpacity>
  );
}
