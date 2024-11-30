import React, { ReactNode } from "react";
import { Platform, StatusBar, View } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
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
  isBackgroundWhite?: boolean;
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
  isBackgroundWhite,
}: LayoutProps) {
  const route = useRoute();
  const shouldUseWhiteBackground =
    isBackgroundWhite ??
    (route.name.startsWith("Onboarding") || route.name.startsWith("Edit"));

  const defaultEdges: Edge[] = ["top", "left", "right", "bottom"];
  const edges =
    safeAreaEdges ||
    (disableBottomSafeArea ? ["top", "left", "right"] : defaultEdges);

  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 ${
        shouldUseWhiteBackground ? "bg-white" : "bg-mainBackground"
      } ${className}`}
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
