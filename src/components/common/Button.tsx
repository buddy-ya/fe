// src/components/common/Button.tsx
import React, { ReactNode } from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
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
        return "w-12 h-12 rounded-full items-center justify-center";
      case "box":
        return "py-5 px-6 rounded-[20px] items-center";
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
      {children}
    </TouchableOpacity>
  );
}
