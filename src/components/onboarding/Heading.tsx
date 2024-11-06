import React from "react";
import { Text } from "react-native";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function Heading({ children, className = "" }: HeadingProps) {
  return (
    <Text className={`text-3xl font-bold my-5 ${className}`}>{children}</Text>
  );
}
