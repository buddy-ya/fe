import { ChevronRight } from "lucide-react-native";
import React, { ReactNode } from "react";
import { Pressable, View } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children?: ReactNode;
  type?: "circle" | "box";
  disabled?: boolean;
  color?: "primary" | "disabled" | "disabled";
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
        return "w-full fixed bottom-4 py-5 rounded-[12px] items-center";
    }
  };

  const getColorStyles = (pressed: boolean) => {
    if (disabled) return "bg-buttonDisabled";
    return pressed ? "bg-active" : "bg-primary";
  };

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <View
          className={`
           ${getTypeStyles()}
           ${getColorStyles(pressed)}
           ${className}
         `}
        >
          {type === "circle" && (
            <ChevronRight strokeWidth={2} size={32} color="white" />
          )}
          {children}
        </View>
      )}
    </Pressable>
  );
}
