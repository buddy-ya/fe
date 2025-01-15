import { AuthRepository } from '@/api';
import { useUserStore } from '@/store';

export function useAuthCheck() {

  const update = useUserStore(state => state.update);

  const checkAuth = async () => {
    try {
      const data = await AuthRepository.checkCertificated();
      update(data);
      return data
    } catch (error) {
      console.error('Auth check failed:', error);
      throw error;
    }
  };

  return {
    checkAuth,
  };
}
