import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import ko_onboarding from "./ko/onboarding.json";
import en_onboarding from "./en/onboarding.json";

const resources = {
  ko: {
    onboarding: ko_onboarding,
  },
  en: {
    onboarding: en_onboarding,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.startsWith("ko") ? "ko" : "en",
  fallbackLng: "en",
  compatibilityJSON: "v3",
  react: {
    useSuspense: true,
  },
});

export default i18n;
