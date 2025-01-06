import { useState } from 'react';
import { ModalTexts } from '@/hooks';
import { AuthRepository } from '@/api';

export function useAuthCheck() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentModalTexts, setCurrentModalTexts] = useState<ModalTexts | null>(null);

  const checkAuth = async () => {
    try {
      return AuthRepository.checkCertificated();
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
