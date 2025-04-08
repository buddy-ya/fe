import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import i18n from '@/i18n';
import linking from '@/navigation/Linking';
import Router from '@/navigation/router';
import AppInitializationProvider from '@/provider/AppInitializationProvider';
import ErrorPage from '@/screens/ErrorPage';
import { useToastStore } from '@/store';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import registerNNPushToken from 'native-notify';
import { Toast } from '@/components/common/Toast';

export const navigationRef = createNavigationContainerRef();

export default function App() {
  const queryClient = new QueryClient();
  const { visible, icon, text, duration, hideToast } = useToastStore();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Suspense fallback={null}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <NavigationContainer ref={navigationRef} linking={linking}>
                <AppInitializationProvider>
                  <Router />
                  <Toast
                    visible={visible}
                    icon={icon!}
                    text={text}
                    duration={duration}
                    onClose={hideToast}
                  />
                </AppInitializationProvider>
              </NavigationContainer>
            </GestureHandlerRootView>
          </Suspense>
        </ErrorBoundary>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
