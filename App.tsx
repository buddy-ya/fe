import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import Router from "@navigation/router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/AuthProvider";
import { ErrorBoundary } from "react-error-boundary";
import Skeleton from "@/screens/Skeleton";
import ErrorPage from "@/screens/ErrorPage";

export default function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        {/* TODO: 스플래시 이미지 전에도 보이는 게 이상해 보일 수 있어서 추후 상의하여 상세 위치 결정 */}
        <Suspense fallback={<Skeleton />}>
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
              <GestureHandlerRootView>
                <Router />
              </GestureHandlerRootView>
            </I18nextProvider>
          </AuthProvider>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider >
  );
}
