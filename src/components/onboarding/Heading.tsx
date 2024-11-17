import React from "react";
import { Text } from "react-native";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function Heading({ children, className = "" }: HeadingProps) {
  return (
    <Text
      className={`text-[24px] font-semibold text-text mt-7 ${className} tracking-wide`}
    >
      {children}
    </Text>
  );
}
