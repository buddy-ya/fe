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
        w-[262px] h-[52px] flex-row items-center px-4 py-4 border rounded-xl mb-3
       ${
         selected
           ? "bg-chipActive border-[1px] border-primary"
           : "border-border"
       }
     `}
    >
      {children}
    </TouchableOpacity>
  );
}
