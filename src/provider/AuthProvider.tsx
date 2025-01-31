import { API, UserRepository } from '@/api';
import SplashScreen from '@/screens/SplashScreen';
import { TokenService } from '@/service';
import { useUserStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface Props {
  children: React.ReactNode;
}

interface CustomJwtPayload extends JwtPayload {
  studentId: number;
}

export default function AuthProvider({ children }: Props) {
  const updateUser = useUserStore((state) => state.update);
  const initAuth = async () => {
    // 토큰이 있으면 API 헤더에 추가. 없으면 그냥 통과
    const accessToken = await TokenService.getAccessToken();

    if (accessToken) {
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    return accessToken;
  };

  const getUser = async (accessToken: string) => {
    const token: CustomJwtPayload = jwtDecode(accessToken);
    const userId = token.studentId;
    const user = await UserRepository.get({ id: userId });
    updateUser(user);
    return user;
  };

  const { data: accessToken, isLoading: authLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: initAuth,
    networkMode: 'always',
    throwOnError: true,
  });

  const { isLoading: getUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await getUser(accessToken as string),
    enabled: !!accessToken,
    throwOnError: true,
    retryDelay: 1000,
  });

  if (authLoading || getUserLoading) return <SplashScreen />;
  return <>{children}</>;
}
