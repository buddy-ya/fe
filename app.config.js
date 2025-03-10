const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  expo: {
    scheme: 'buddyya',
    name: 'buddyya',
    owner: 'buddyya',
    description: 'A friendly app for buddy management.',
    slug: 'buddyya',
    version: '1.0.2',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    splash: {
      // 스플래시 스크린 이미지: 앱 로딩 시 표시되는 이미지의 경로
      image: './assets/images/logo.png',
      // resizeMode: 이미지의 크기 조정 방식 ('contain'은 이미지 비율을 유지하며 전체가 보이도록 조정)
      resizeMode: 'contain',
      // 배경색: 스플래시 이미지 주변에 적용할 배경색
      backgroundColor: '#ffffff',
    },
    // 앱 아이콘: 앱 아이콘 이미지 파일의 경로 (일반적으로 정사각형의 고해상도 이미지 권장)
    icon: './assets/images/icon.png',
    plugins: [
      [
        'expo-notifications',
        {
          color: '#ffffff',
        },
      ],
      'expo-dev-client',
      'expo-font',
      'expo-localization',
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
    ],
    ios: {
      bundleIdentifier: 'com.buddyya.app',
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ['remote-notification'],
        'aps-environment': 'development',
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
      },
    },
    android: {
      package: 'com.buddyya.app',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      BASE_URL: process.env.BASE_URL,
      BASE_DOMAIN: process.env.BASE_DOMAIN,
      eas: {
        projectId: 'ae3e9ea5-3d73-4892-894d-2308ea11ed5c',
      },
    },
  },
};
