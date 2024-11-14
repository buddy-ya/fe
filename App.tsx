import React, { Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import Router from "@navigation/router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <Suspense fallback={<></>}>
      <I18nextProvider i18n={i18n}>
        <GestureHandlerRootView>
          <Router />
        </GestureHandlerRootView>
      </I18nextProvider>
    </Suspense>
  );
}
