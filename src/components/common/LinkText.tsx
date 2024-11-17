import React from "react";
import { Text, TouchableOpacity } from "react-native";

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
      <Text className={`text-primary text-sm underline ${className}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
