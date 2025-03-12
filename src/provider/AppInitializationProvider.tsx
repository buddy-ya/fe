import React, { useEffect, useState, useRef } from 'react';
import { View, AppState, AppStateStatus, StyleSheet } from 'react-native';
import { API, UserRepository, ChatSocketRepository } from '@/api';
import { TokenService } from '@/service';
import { useUserStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Image as ExpoImage } from 'expo-image';
import { jwtDecode } from 'jwt-decode';
import { reissueToken } from '@/api/API';
import { showErrorModal } from '@/utils';

const FONTS = {
  'Pretendard-Thin': require('@assets/fonts/Pretendard-Thin.otf'),
  // ... 나머지 폰트
};

export interface CustomJwtPayload {
  exp: number;
  studentId: number;
}

export async function getValidAccessToken(): Promise<string | null> {
  let accessToken = await TokenService.getAccessToken();
  if (!accessToken) return null;
  const tokenPayload: CustomJwtPayload = jwtDecode(accessToken);
  const now = Date.now() / 1000;
  if (tokenPayload.exp < now + 300) {
    const refreshToken = await TokenService.getRefreshToken();
    if (!refreshToken) throw new Error('Refresh token not found');
    try {
      const { accessToken: newAccessToken } = await reissueToken(refreshToken);
      await TokenService.setAccessToken(newAccessToken);
      accessToken = newAccessToken;
    } catch (error) {
      await TokenService.remove();
      showErrorModal('tokenExpired');
      throw error;
    }
  }
  return accessToken;
}

async function getUser(): Promise<'Tab' | 'Onboarding'> {
  const token = await TokenService.getAccessToken();
  if (!token) {
    useUserStore.getState().init();
    return 'Onboarding';
  }
  const accessToken = await getValidAccessToken();
  API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  await ChatSocketRepository.initialize();
  const tokenPayload: CustomJwtPayload = jwtDecode(accessToken);
  const userId = tokenPayload.studentId;
  const user = await UserRepository.get({ id: userId });
  useUserStore.getState().update({ ...user });
  return 'Tab';
}

interface Props {
  children: React.ReactNode;
}

const AppInitializationProvider: React.FC<Props> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Tab' | 'Onboarding' | null>(null);
  const [isSplashHidden, setSplashHidden] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const isInitialLoad = useRef(true);
  const navigation = useNavigation<any>();

  const loadFonts = async () => {
    await Font.loadAsync(FONTS);
  };

  const initializeAppOnLaunch = async () => {
    try {
      await loadFonts();
      const route = await getUser();
      setInitialRoute(route);
    } catch (error) {
      console.error('Initialization error:', error);
      setInitialRoute('Onboarding');
    }
  };

  const refreshTokenOnForeground = async () => {
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await ChatSocketRepository.initialize();
      }
    } catch (error) {
      console.error('Foreground token refresh error:', error);
    }
  };

  const initializeApp = async () => {
    if (isInitialLoad.current) {
      await initializeAppOnLaunch();
      isInitialLoad.current = false;
    } else {
      await refreshTokenOnForeground();
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await initializeApp();
        setIsInitialized(true);
      } catch (error) {
        console.error(error);
      }
    }
    prepare();
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          console.log('Foreground transition: refreshing token');
          await initializeApp();
        }
        appState.current = nextAppState;
      }
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isInitialized && initialRoute && navigation?.isReady && navigation.isReady()) {
      navigation.navigate(initialRoute);
    }
  }, [isInitialized, initialRoute, navigation]);

  useEffect(() => {
    if (isInitialized && initialRoute) {
      const timer = setTimeout(() => setSplashHidden(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, initialRoute]);

  const splashImage = require('@assets/images/splash/android.png');

  return (
    <View style={{ flex: 1 }}>
      {children}
      {!isSplashHidden && (
        <View className="absolute left-0 top-0 h-full w-full flex-1 bg-primary">
          <ExpoImage
            source={splashImage}
            contentFit="contain"
            style={{ height: '100%', width: '100%' }}
          />
        </View>
      )}
    </View>
  );
};

export default AppInitializationProvider;
