import React, { ReactNode } from "react";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";
import Header, { BackButton } from "./Header";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  preserveHeader?: boolean;
  onBack?: () => void;
  headerLeft?: ReactNode;
  headerCenter?: ReactNode;
  headerRight?: ReactNode;
  hasTabBar?: boolean;
}

export default function Layout({
  children,
  showHeader,
  preserveHeader,
  onBack,
  headerLeft,
  headerCenter,
  headerRight,
  hasTabBar,
}: LayoutProps) {
  const TAB_BAR_HEIGHT = Platform.select({
    ios: 85,
    android: 65,
  });

  return (
    <SafeAreaView
      className={`flex-1 bg-white ${
        hasTabBar ? `pb-[${TAB_BAR_HEIGHT}px]` : ""
      }`}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {showHeader && (
        <Header
          leftContent={
            headerLeft || (onBack && <BackButton onPress={onBack} />)
          }
          centerContent={headerCenter}
          rightContent={headerRight}
        />
      )}
      {preserveHeader && <View className="h-[44px]" />}
      {children}
    </SafeAreaView>
  );
}
