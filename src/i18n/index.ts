import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import ko_onboarding from "./ko/onboarding.json";
import en_onboarding from "./en/onboarding.json";
import ko_countries from "./ko/countries.json";
import en_countries from "./en/countries.json";
import ko_languages from "./ko/languages.json";
import en_languages from "./en/languages.json";
import ko_interests from "./ko/interests.json";
import en_interests from "./en/interests.json";
import ko_majors from "./ko/majors.json";
import en_majors from "./en/majors.json";
import ko_common from "./ko/common.json";
import en_common from "./en/common.json";
import ko_feed from "./ko/feed.json";
import en_feed from "./en/feed.json";

const resources = {
  ko: {
    onboarding: ko_onboarding,
    majors: ko_majors,
    countries: ko_countries,
    languages: ko_languages,
    interests: ko_interests,
    common: ko_common,
    feed: ko_feed,
  },
  en: {
    onboarding: en_onboarding,
    majors: en_majors,
    countries: en_countries,
    languages: en_languages,
    interests: en_interests,
    common: en_common,
    feed: en_feed,
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
