import React, { Suspense, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import Router from "@navigation/router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<></>}>
        <I18nextProvider i18n={i18n}>
          <GestureHandlerRootView>
            <Router />
          </GestureHandlerRootView>
        </I18nextProvider>
      </Suspense>
    </QueryClientProvider>
  );
}
