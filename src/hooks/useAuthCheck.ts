import { useState } from "react";
import { ModalTexts } from "@/utils/constants/ModalTexts";
import AuthRepository from "@/api/AuthRepository";

export function useAuthCheck() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentModalTexts, setCurrentModalTexts] = useState<ModalTexts | null>(
    null
  );

  const checkAuth = async () => {
    try {
      return await AuthRepository.checkCertificated();
    } catch (error) {
      console.error("Auth check failed:", error);
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
