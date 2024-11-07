// src/components/onboarding/SelectItem.tsx
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Check } from "lucide-react-native";

interface SelectItemProps {
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

export default function SelectItem({
  selected,
  disabled,
  onPress,
  children,
}: SelectItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
       flex-row items-center justify-between px-6 py-5 border rounded-3xl mb-4
       ${selected ? "bg-green-50 border-primary" : "border-gray-200"}
     `}
    >
      {children}
      {selected && <Check className={"border"} size={20} color={"black"} />}
    </TouchableOpacity>
  );
}
