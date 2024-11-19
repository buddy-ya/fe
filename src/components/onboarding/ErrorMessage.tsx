import React from "react";
import { Text } from "react-native";

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export default function ErrorMessage({
  children,
  className,
}: ErrorMessageProps) {
  return (
    <Text className={`text-textWarning text-sm mb-2 ${className}`}>
      {children}
    </Text>
  );
}
