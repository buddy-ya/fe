import React, { ReactNode } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import Header, { BackButton } from "./Header";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  onBack?: () => void;
  headerLeft?: ReactNode;
  headerCenter?: ReactNode;
  headerRight?: ReactNode;
}

export default function Layout({
  children,
  showHeader,
  onBack,
  headerLeft,
  headerCenter,
  headerRight,
}: LayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {showHeader ? (
        <Header
          leftContent={
            headerLeft || (onBack && <BackButton onPress={onBack} />)
          }
          centerContent={headerCenter}
          rightContent={headerRight}
        />
      ) : (
        <View className="h-[44px]" />
      )}
      {children}
    </SafeAreaView>
  );
}
