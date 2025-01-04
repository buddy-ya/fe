import { apiClient } from '../apiClient';

export const postPhoneVerification = async (phoneNumber: string) => {
  return await apiClient.post('/phone-auth/send-code', { phoneNumber });
};

export const postPhoneVerifyCode = async (phoneNumber: string, code: string) => {
  return await apiClient.post('/phone-auth/verify-code', { phoneNumber, code });
};
