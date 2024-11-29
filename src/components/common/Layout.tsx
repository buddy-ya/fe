import React, { ReactNode } from "react";
import { Platform, StatusBar, View } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import Header, { BackButton } from "./Header";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  preserveHeader?: boolean;
  onBack?: () => void;
  headerLeft?: ReactNode;
  headerCenter?: ReactNode;
  headerRight?: ReactNode;
  hasTabBar?: boolean;
  safeAreaEdges?: Edge[];
  disableBottomSafeArea?: boolean;
}

export default function Layout({
  children,
  className,
  showHeader,
  preserveHeader,
  onBack,
  headerLeft,
  headerCenter,
  headerRight,
  hasTabBar,
  safeAreaEdges,
  disableBottomSafeArea,
}: LayoutProps) {
  const TAB_BAR_HEIGHT = Platform.select({
    ios: 85,
    android: 65,
  });

  const defaultEdges: Edge[] = ["top", "left", "right", "bottom"];
  const edges =
    safeAreaEdges ||
    (disableBottomSafeArea ? ["top", "left", "right"] : defaultEdges);

  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 bg-mainBackground ${className}`}
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
