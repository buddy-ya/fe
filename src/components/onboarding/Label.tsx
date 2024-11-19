import React from "react";
import { View, Text } from "react-native";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function Label({ children, className }: LabelProps) {
  return (
    <View className={`mt-10 mb-3 ${className}`}>
      <Text className="font-semibold text-base">{children}</Text>
    </View>
  );
}
