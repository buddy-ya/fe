// src/components/common/Button.tsx
import { ChevronRight } from "lucide-react-native";
import React, { ReactNode } from "react";
import { TouchableOpacity } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children?: ReactNode;
  type?: "circle" | "box";
  disabled?: boolean;
  color?: "primary" | "secondary" | "disabled";
  className?: string;
}

export default function Button({
  onPress,
  children,
  type = "box",
  disabled = false,
  className = "",
}: ButtonProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "circle":
        return "w-11 h-11 rounded-full items-center justify-center";
      case "box":
        return "fixed bottom-4 py-5 rounded-[12px] items-center";
    }
  };

  const getColorStyles = () => {
    if (disabled) return "bg-buttonDisabled";
    return "bg-primary";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
        ${getTypeStyles()}
        ${getColorStyles()}
        ${className}
      `}
    >
      {type == "circle" && (
        <ChevronRight strokeWidth={2} size={32} color={"white"} />
      )}
      {children}
    </TouchableOpacity>
  );
}
