import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import ko_common from "./ko/common.json";
import ko_onboarding from "./ko/onboarding.json";
import ko_home from "./ko/home.json";
import ko_matching from "./ko/matching.json";
import ko_chat from "./ko/chat.json";
import ko_feed from "./ko/feed.json";
import ko_mypage from "./ko/mypage.json";

import en_common from "./en/common.json";
import en_onboarding from "./en/onboarding.json";
import en_home from "./en/home.json";
import en_matching from "./en/matching.json";
import en_chat from "./en/chat.json";
import en_feed from "./en/feed.json";
import en_mypage from "./en/mypage.json";

const resources = {
  ko: {
    translation: {
      common: ko_common,
      onboarding: ko_onboarding,
      home: ko_home,
      matching: ko_matching,
      chat: ko_chat,
      feed: ko_feed,
      mypage: ko_mypage,
    },
  },
  en: {
    translation: {
      common: en_common,
      onboarding: en_onboarding,
      home: en_home,
      matching: en_matching,
      chat: en_chat,
      feed: en_feed,
      mypage: en_mypage,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.startsWith("ko") ? "ko" : "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
