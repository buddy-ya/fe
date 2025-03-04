import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import i18n from '@/i18n';
import linking from '@/navigation/Linking';
import Router from '@/navigation/router';
import { AuthProvider } from '@/provider';
import ErrorPage from '@/screens/ErrorPage';
import { useToastStore } from '@/store';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toast } from '@/components/common/Toast';

export const navigationRef = createNavigationContainerRef();

export default function App() {
  const queryClient = new QueryClient();
  const { visible, icon, text, hideToast } = useToastStore();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Suspense fallback={<></>}>
            <GestureHandlerRootView>
              <AuthProvider>
                <NavigationContainer ref={navigationRef} linking={linking}>
                  <Router />
                  <Toast visible={visible} icon={icon!} text={text} onClose={hideToast} />
                </NavigationContainer>
              </AuthProvider>
            </GestureHandlerRootView>
          </Suspense>
        </ErrorBoundary>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
