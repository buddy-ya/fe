import { API } from '@/api';
import { TokenService } from '@/service';
import { useSuspenseQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const initAuth = async () => {
    // 토큰이 있으면 API 헤더에 추가. 없으면 그냥 통과
    const accessToken = await TokenService.getAccessToken();

    if (accessToken) {
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    return accessToken;
  };

  useSuspenseQuery({
    queryKey: ['auth'],
    queryFn: initAuth,
    networkMode: 'always',
  });

  return <>{children}</>;
}
