import React, { ReactNode } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  onBack?: () => void;
}

export default function Layout({ children, showHeader, onBack }: LayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {showHeader && <Header onBack={onBack} />}
      {children}
    </SafeAreaView>
  );
}
