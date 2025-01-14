import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import Router from "@/navigation/router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/provider";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "@/screens/ErrorPage";
import { useBottomModalStore } from "@/store";
import { BottomModal } from "@/components";

export default function App() {

  const queryClient = new QueryClient();
  const bottomModalVisible = useBottomModalStore(state => state.visible);
  const bottomModalOptions = useBottomModalStore(state => state.optionList);
  const handleBottomModalClose = useBottomModalStore(state => state.handleClose);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Suspense fallback={<></>}>
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
              <GestureHandlerRootView>
                <Router />
                <BottomModal visible={bottomModalVisible} onClose={handleBottomModalClose} options={bottomModalOptions} />
              </GestureHandlerRootView>
            </I18nextProvider>
          </AuthProvider>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider >
  );
}
