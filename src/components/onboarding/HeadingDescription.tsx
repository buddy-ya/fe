import React from "react";
import { Text } from "react-native";

interface HeadingDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeadingDescription({
  children,
  className = "",
}: HeadingDescriptionProps) {
  return (
    <Text className={`text-[14px] text-textDescription mt-3 ${className}`}>
      {children}
    </Text>
  );
}
