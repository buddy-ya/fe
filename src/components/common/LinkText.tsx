import React from "react";
import { TouchableOpacity } from "react-native";
import MyText from "@/components/common/MyText";

interface LinkTextProps {
  onPress: () => void;
  children: string;
  className?: string;
}

export default function LinkText({
  onPress,
  children,
  className = "",
}: LinkTextProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <MyText
        size="text-sm"
        color="text-primary"
        className={`underline ${className}`}
      >
        {children}
      </MyText>
    </TouchableOpacity>
  );
}
