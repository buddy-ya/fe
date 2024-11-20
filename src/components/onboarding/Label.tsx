import React from "react";
import { View, Text } from "react-native";
import MyText from "../common/MyText";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function Label({ children, className }: LabelProps) {
  return (
    <View className={`mt-10 mb-3 ${className}`}>
      <MyText size="text-base" className="font-semibold">
        {children}
      </MyText>
    </View>
  );
}
