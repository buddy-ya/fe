import React from "react";
import { Text } from "react-native";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function Heading({ children, className = "" }: HeadingProps) {
  return (
    <Text className={`text-[26px] font-bold mb-2 ${className}`}>
      {children}
    </Text>
  );
}
