const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.MODE}`),
});

module.exports = {
  expo: {
    // General
    name: 'Buddyya',
    slug: 'buddyya',
    scheme: 'buddyya',
    owner: 'buddyya',
    version: '1.1.4',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    description: 'A friendly app for buddy management.',

    // Assets
    icon: './assets/images/icon/icon.png',
    splash: {
      image: './assets/images/icon/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#00A176',
    },
    assetBundlePatterns: ['./assets/fonts/*'],

    // Plugins
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/images/icon/128.png',
          color: '#00A176',
          defaultChannel: 'default',
          androidMode: 'default',
          androidImportance: 'high',
          androidShowWhen: true,
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

    // iOS
    ios: {
      bundleIdentifier: 'com.buddyya.app',
      supportsTablet: false,
      infoPlist: {
        UIBackgroundModes: ['remote-notification'],
        apsEnvironment: 'production',
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
        ITSAppUsesNonExemptEncryption: false,
        LSApplicationQueriesSchemes: ['instagram'],
        NSCameraUsageDescription:
          'Buddyya requires camera access to capture photos for content creation.',
        NSPhotoLibraryUsageDescription:
          'Buddyya requires photo library access to select images for your profile and to provide content sharing.',
      },
    },

    // Android
    android: {
      package: 'com.buddyya.app',
      permissions: ['NOTIFICATIONS', 'VIBRATE', 'WAKE_LOCK'],
      googleServicesFile: './google-services.json',
      useNextNotificationsApi: true,
      notification: {
        icon: './assets/images/icon/128.png',
        color: '#00A176',
        androidMode: 'default',
        androidImportance: 'high',
        androidShowWhen: true,
        priority: 'high',
        vibrate: true,
        headless: true,
      },
      intentFilters: [
        {
          action: 'android.intent.action.VIEW',
          category: ['android.intent.category.DEFAULT', 'android.intent.category.BROWSABLE'],
          data: { scheme: 'buddyya' },
        },
      ],
    },

    // Extras
    extra: {
      MODE: process.env.MODE,
      BASE_URL: process.env.BASE_URL,
      BASE_DOMAIN: process.env.BASE_DOMAIN,
      eas: {
        projectId: 'ae3e9ea5-3d73-4892-894d-2308ea11ed5c',
      },
    },
  },
};
