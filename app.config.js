const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  expo: {
    scheme: 'buddyya',
    name: 'buddyya',
    owner: 'buddyya',
    description: 'A friendly app for buddy management.',
    slug: 'buddyya',
    version: '1.0.5',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    icon: './assets/images/icon/icon.png',
    splash: {
      image: './assets/images/splash/2000.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/images/icon/96.png',
          color: '#00A176',
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
        'aps-environment': 'production',
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
      },
    },
    android: {
      package: 'com.buddyya.app',
      permissions: ['NOTIFICATIONS', 'VIBRATE', 'WAKE_LOCK'],
      googleServicesFile: './google-services.json',
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
