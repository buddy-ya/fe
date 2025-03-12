import React, { useEffect, useState, useRef } from 'react';
import { View, AppState, AppStateStatus } from 'react-native';
import { API, UserRepository, ChatSocketRepository } from '@/api';
import { TokenService } from '@/service';
import { useUserStore } from '@/store';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { jwtDecode } from 'jwt-decode';
import { reissueToken } from '@/api/API';
import { showErrorModal } from '@/utils';

const FONTS = {
  'Pretendard-Thin': require('@assets/fonts/Pretendard-Thin.otf'),
  'Pretendard-ExtraLight': require('@assets/fonts/Pretendard-ExtraLight.otf'),
  'Pretendard-Light': require('@assets/fonts/Pretendard-Light.otf'),
  'Pretendard-Regular': require('@assets/fonts/Pretendard-Regular.otf'),
  'Pretendard-Medium': require('@assets/fonts/Pretendard-Medium.otf'),
  'Pretendard-SemiBold': require('@assets/fonts/Pretendard-SemiBold.otf'),
  'Pretendard-Bold': require('@assets/fonts/Pretendard-Bold.otf'),
  'Pretendard-ExtraBold': require('@assets/fonts/Pretendard-ExtraBold.otf'),
  'Pretendard-Black': require('@assets/fonts/Pretendard-Black.otf'),
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

// 최초 실행 시 호출되어 사용자 정보를 받아오고, 웹소켓 초기화를 수행합니다.
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
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const isInitialLoad = useRef(true);
  const navigation = useNavigation<any>();

  const loadFonts = async () => {
    await Font.loadAsync(FONTS);
  };

  // 초기 실행 시 호출되는 함수: 폰트 로드 및 사용자 정보 설정 포함
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

  // 포그라운드 전환 시에는 토큰 유효성만 검사합니다.
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
        await SplashScreen.preventAutoHideAsync();
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
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isInitialized && initialRoute) {
      navigation.navigate(initialRoute);
      SplashScreen.hideAsync();
    }
  }, [isInitialized, initialRoute, navigation]);

  if (!isInitialized) {
    return <View style={{ flex: 1 }} />;
  }

  return <>{children}</>;
};

export default AppInitializationProvider;
