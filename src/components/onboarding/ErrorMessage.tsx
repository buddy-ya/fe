import React from "react";
import { Text } from "react-native";

interface ErrorMessageProps {
  children: React.ReactNode;
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return <Text className={`text-textWarning text-sm mb-2`}>{children}</Text>;
}
