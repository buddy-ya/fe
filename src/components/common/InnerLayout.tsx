import React, { ReactNode } from "react";
import { View } from "react-native";

interface InnerLayoutProps {
  children: ReactNode;
}
export default function InnerLayout({ children }: InnerLayoutProps) {
  return <View className="flex-1 px-5">{children}</View>;
}
