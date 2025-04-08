const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  expo: {
    scheme: 'buddyya',
    name: 'buddyya',
    owner: 'buddyya-personal',
    description: 'A friendly app for buddy management.',
    slug: 'buddyya',
    version: '1.0.6',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    icon: './assets/images/icon/icon.png',
    splash: {
      image: './assets/images/icon/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#00A176',
    },
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/images/icon/128.png',
          color: '#00A176',
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
    ios: {
      bundleIdentifier: 'com.buddyya.app',
      supportsTablet: false,
      infoPlist: {
        UIBackgroundModes: ['remote-notification'],
        'aps-environment': 'production',
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
          data: {
            scheme: 'buddyya',
          },
        },
      ],
    },
    extra: {
      BASE_URL: process.env.BASE_URL,
      BASE_DOMAIN: process.env.BASE_DOMAIN,
      eas: {
        projectId: 'ac2fa962-0fb3-4186-9c25-840a607c0c90',
      },
    },
  },
};
