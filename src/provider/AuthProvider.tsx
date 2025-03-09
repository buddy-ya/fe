import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { API, ChatSocketRepository, UserRepository } from '@/api';
import { TokenService } from '@/service';
import { useUserStore } from '@/store';
import * as Font from 'expo-font';
import { jwtDecode } from 'jwt-decode';
import { reissueToken } from '@/api/API';
import { showErrorModal } from '@/utils';

interface Props {
  children: React.ReactNode;
}

export interface CustomJwtPayload {
  exp: number;
  studentId: number;
}

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

// 헬퍼 함수: 토큰 만료 여부 확인 및 재발급 처리
export async function getValidAccessToken(): Promise<string> {
  let accessToken = await TokenService.getAccessToken();
  if (!accessToken) {
    throw new Error('Access token not found');
  }
  const tokenPayload: CustomJwtPayload = jwtDecode(accessToken);
  const now = Date.now() / 1000;
  // 토큰 만료 5분 전부터 재발급 시도
  if (tokenPayload.exp < now + 300) {
    const refreshToken = await TokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    try {
      const { accessToken: newAccessToken } = await reissueToken(refreshToken);
      // 새 토큰 업데이트
      await TokenService.setAccessToken(newAccessToken);
      accessToken = newAccessToken;
    } catch (error) {
      // 재발급 실패 시 처리
      await TokenService.remove();
      useUserStore.getState().init();
      showErrorModal('tokenExpired');
      throw error;
    }
  }
  return accessToken;
}

export default function AuthProvider({ children }: Props) {
  const [initLoading, setInitLoading] = useState(true);
  const update = useUserStore((state) => state.update);

  // 폰트 로드 함수
  const loadFonts = async () => {
    await Font.loadAsync(FONTS);
  };

  // 사용자 정보를 불러오는 함수
  const getUser = async () => {
    try {
      // 토큰이 존재하는지 미리 확인
      const initialToken = await TokenService.getAccessToken();
      if (!initialToken) {
        update({ isAuthenticated: false });
        return;
      }

      // 1. 최신 토큰 확보 및 API 헤더 설정
      let accessToken = await getValidAccessToken();
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // 2. 토큰 페이로드에서 사용자 ID 추출 후 사용자 정보 요청
      const tokenPayload: CustomJwtPayload = jwtDecode(accessToken);
      const userId = tokenPayload.studentId;
      const user = await UserRepository.get({ id: userId });

      // 3. 재확인: 최신 토큰 재확보 (내부에서 재발급 발생 가능성 고려)
      accessToken = await getValidAccessToken();
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // 4. 사용자 상태 업데이트
      update({ ...user, isAuthenticated: true });

      await ChatSocketRepository.initialize();
    } catch (e) {
      console.error(e);
    }
  };

  const initializeApp = async () => {
    try {
      await loadFonts();
      await getUser();
    } catch (e) {
      console.error(e);
    } finally {
      setInitLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  if (initLoading)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('@assets/images/splash.png')}
          style={{ flex: 1, resizeMode: 'contain' }}
        />
      </View>
    );

  return <>{children}</>;
}
