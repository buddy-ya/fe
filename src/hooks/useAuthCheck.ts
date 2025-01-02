import { useState } from 'react';
import { getIsCertificated } from '@/api/certification/certification';
import { ModalTexts } from '@/hooks/modal/useAuthModal';

export function useAuthCheck() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentModalTexts, setCurrentModalTexts] = useState<ModalTexts | null>(null);

  const checkAuth = async () => {
    try {
      return await getIsCertificated();
    } catch (error) {
      console.error('Auth check failed:', error);
      throw error;
    }
  };

  return {
    isModalVisible,
    setIsModalVisible,
    currentModalTexts,
    setCurrentModalTexts,
    checkAuth,
  };
}
