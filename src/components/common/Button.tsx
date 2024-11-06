import React, { ReactNode } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  type?: "circle" | "box";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  onPress,
  children,
  type = "box",
  disabled = false,
  loading = false,
  className = "",
}: ButtonProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "circle":
        return "w-14 h-14 rounded-full items-center justify-center";
      case "box":
        return "py-5 px-6 rounded-[20px] items-center";
      default:
        return "py-5 px-6 rounded-[20px] items-center";
    }
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${getTypeStyles()}
        ${disabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      {children}
    </TouchableOpacity>
  );
}
