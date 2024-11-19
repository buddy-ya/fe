import React, { ReactNode } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  preserveHeader?: boolean;
  onBack?: () => void;
}

export default function Layout({
  children,
  showHeader,
  preserveHeader = false,
  onBack,
}: LayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {showHeader ? (
        <Header onBack={onBack} />
      ) : (
        preserveHeader && <View className="h-[52px]" />
      )}
      {children}
    </SafeAreaView>
  );
}
