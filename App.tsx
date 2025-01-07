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
