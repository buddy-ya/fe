const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  expo: {
    name: 'buddyya',
    scheme: 'buddyya',
    description: 'A friendly app for buddy management.',
    slug: 'buddyya',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/images/logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
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
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.buddyya.app',
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
      eas: {
        projectId: 'ae3e9ea5-3d73-4892-894d-2308ea11ed5c',
      },
    },
  },
};
