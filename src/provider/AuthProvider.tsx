import { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { API, UserRepository } from '@/api';
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

  // TODO: 모듈화 필요
  const getUser = async () => {
    setInitLoading(true);
    try {
      const accessToken = await TokenService.getAccessToken();
      if (accessToken) {
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const token: CustomJwtPayload = jwtDecode(accessToken);
        const userId = token.studentId;
        const user = await UserRepository.get({ id: userId });
        update({ ...user, isAuthenticated: true });
      }
    } catch (e) {
      console.log(e);
    } finally {
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
