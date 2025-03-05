import { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { API, ChatSocketRepository, UserRepository } from '@/api';
import { TokenService } from '@/service';
import { useUserStore } from '@/store';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface Props {
  children: React.ReactNode;
}

export interface CustomJwtPayload extends JwtPayload {
  studentId: number;
}

export default function AuthProvider({ children }: Props) {
  const [initLoading, setInitLoading] = useState(false);
  const update = useUserStore((state) => state.update);

  const getUser = async () => {
    setInitLoading(true);
    try {
      let accessToken = await TokenService.getAccessToken();
      if (accessToken) {
        // 최초 토큰 설정
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const token: CustomJwtPayload = jwtDecode(accessToken);
        const userId = token.studentId;

        // 사용자 정보 호출 (여기서 토큰 재발급 로직이 내부적으로 처리된다면)
        const user = await UserRepository.get({ id: userId });

        // 만약 토큰이 재발급되었다면 새 토큰으로 업데이트
        accessToken = await TokenService.getAccessToken();
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        update({ ...user, isAuthenticated: true });

        await ChatSocketRepository.initialize();
      }
      setInitLoading(false);
    } catch (e) {
      console.log(e);
      setInitLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (initLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <Image source={require('@assets/images/splash.png')} className="h-full w-full" />
      </View>
    );
  return <>{children}</>;
}
