import { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { API, AuthRepository, UserRepository } from '@/api';
import { TokenService } from '@/service';
import { useUserStore } from '@/store';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { showErrorModal, TOKEN_KEYS } from '@/utils';

interface Props {
  children: React.ReactNode;
}

interface CustomJwtPayload extends JwtPayload {
  studentId: number;
}

export default function AuthProvider({ children }: Props) {
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const updateUser = useUserStore((state) => state.update);
  const initAuth = async () => {
    // 토큰이 있으면 API 헤더에 추가. 없으면 그냥 통과
    const accessToken = await TokenService.getAccessToken();

    if (accessToken) {
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const token: CustomJwtPayload = jwtDecode(accessToken);
      const userId = token.studentId;
      const user = await UserRepository.get({ id: userId });
      updateUser({ ...user, isAuthenticated: true });
    }
    return accessToken;
  };

  useEffect(() => {
    setInitLoading(true);
    initAuth();
    setInitLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    API.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.response) {
          showErrorModal('network');
          return Promise.reject(error);
        }
        const errorCode = error.response?.data?.code;

        if (error.response?.status === 401 && errorCode === 3002 && !error.config._retry) {
          error.config._retry = true;
          try {
            const refreshToken = await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
            if (!refreshToken) {
              throw new Error('Refresh token not found');
            }
            const { accessToken, refreshToken: newRefreshToken } =
              await AuthRepository.reissueToken(refreshToken);

            await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
            await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, newRefreshToken);
            error.config.headers.common.Authorization = `Bearer ${accessToken}`;
            return API(error.config);
          } catch (reissueError) {
            await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
            await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
            delete API.defaults.headers.common['Authorization'];
            updateUser({ isAuthenticated: false });
            showErrorModal('tokenExpired');
            return Promise.reject(reissueError);
          }
        }
        return Promise.reject(error);
      }
    );
    setLoading(false);
  }, []);

  if (initLoading || loading)
    return (
      <View className="flex-1 items-center justify-center">
        <Image source={require('@assets/images/splash.png')} className="h-full w-full" />
      </View>
    );
  return <>{children}</>;
}
