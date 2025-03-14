import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import en_certification from './en/certification.json';
import en_chat from './en/chat.json';
import en_common from './en/common.json';
import en_countries from './en/countries.json';
import en_error from './en/error.json';
import en_feed from './en/feed.json';
import en_interests from './en/interests.json';
import en_languages from './en/languages.json';
import en_majors from './en/majors.json';
import en_mypage from './en/mypage.json';
import en_onboarding from './en/onboarding.json';
import en_toast from './en/toast.json';
import en_universities from './en/universities.json';
import ko_certification from './ko/certification.json';
import ko_chat from './ko/chat.json';
import ko_common from './ko/common.json';
import ko_countries from './ko/countries.json';
import ko_error from './ko/error.json';
import ko_feed from './ko/feed.json';
import ko_interests from './ko/interests.json';
import ko_languages from './ko/languages.json';
import ko_majors from './ko/majors.json';
import ko_mypage from './ko/mypage.json';
import ko_onboarding from './ko/onboarding.json';
import ko_toast from './ko/toast.json';
import ko_universities from './ko/universities.json';

const resources = {
  ko: {
    chat: ko_chat,
    onboarding: ko_onboarding,
    universities: ko_universities,
    majors: ko_majors,
    countries: ko_countries,
    languages: ko_languages,
    interests: ko_interests,
    common: ko_common,
    feed: ko_feed,
    certification: ko_certification,
    mypage: ko_mypage,
    error: ko_error,
    toast: ko_toast,
  },
  en: {
    chat: en_chat,
    onboarding: en_onboarding,
    universities: en_universities,
    majors: en_majors,
    countries: en_countries,
    languages: en_languages,
    interests: en_interests,
    common: en_common,
    feed: en_feed,
    certification: en_certification,
    mypage: en_mypage,
    error: en_error,
    toast: en_toast,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.startsWith('ko') ? 'ko' : 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  react: {
    useSuspense: true,
  },
});

export default i18n;
