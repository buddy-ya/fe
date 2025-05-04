import React, { ReactNode } from 'react';
import { StatusBar, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Header, { BackButton } from '../Header';

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
  isSearchLayout?: boolean;
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
  safeAreaEdges,
  disableBottomSafeArea,
  isBackgroundWhite,
  isSearchLayout,
}: LayoutProps) {
  const route = useRoute();
  const shouldUseWhiteBackground =
    isBackgroundWhite ??
    (route.name.startsWith('Onboarding') ||
      route.name.startsWith('Edit') ||
      route.name.startsWith('Email') ||
      route.name.startsWith('StudentId'));

  const bgColor = shouldUseWhiteBackground ? '#FFFFFF' : '#F6F6F6';

  // header 영역에서는 top inset만, body 영역에서는 top 제외
  const headerEdges: Edge[] = ['top', 'left', 'right'];
  const bodyEdges: Edge[] = safeAreaEdges
    ? safeAreaEdges.filter((e) => e !== 'top')
    : disableBottomSafeArea
      ? ['left', 'right']
      : ['left', 'right', 'bottom'];

  return (
    <>
      {/* 헤더만 top inset 적용 */}
      <SafeAreaView edges={headerEdges} style={{ backgroundColor: bgColor }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        {showHeader && (
          <Header
            isSearchLayout={isSearchLayout}
            leftContent={headerLeft || (onBack && <BackButton onPress={onBack} />)}
            centerContent={headerCenter}
            rightContent={headerRight}
          />
        )}
        {preserveHeader && <View style={{ height: 44 }} />}
      </SafeAreaView>

      {/* 본문은 top inset 없이 시작 */}
      <SafeAreaView
        edges={bodyEdges}
        style={[{ flex: 1, backgroundColor: bgColor } as ViewStyle]}
        className={className}
      >
        {children}
      </SafeAreaView>
    </>
  );
}
