import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import Router from "@/navigation/router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/provider";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "@/screens/ErrorPage";

export default function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Suspense fallback={<></>}>
            <GestureHandlerRootView>
              <AuthProvider>
                <Router />
              </AuthProvider>
            </GestureHandlerRootView>
          </Suspense>
        </ErrorBoundary>
      </I18nextProvider>

    </QueryClientProvider >
  );
}
