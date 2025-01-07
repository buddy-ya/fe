const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const isProduction = process.env.EAS_BUILD_PROFILE === 'production';

module.exports = {
  expo: {
    name: 'buddyya',
    description: 'A friendly app for buddy management.',
    slug: 'buddyya',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    icon: './assets/images/logo.png',
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
        projectId: '6623b9dc-65be-4af9-b342-a33c0dc8cab6',
      },
    },
  },
};
