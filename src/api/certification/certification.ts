import { logError } from '@/utils/service/error';
import { processImageForUpload } from '@/utils/service/image';
import { apiClient } from '../apiClient';

export const getIsCertificated = async () => {
  try {
    const { data } = await apiClient.get(`/certification`);
    return data;
  } catch (error) {
    logError(error);
  }
};

export const sendEmail = async (requestBody) => {
  const url = '/certification/email/send';
  try {
    await apiClient.post(url, requestBody);
  } catch (error) {
    logError(error);
  }
};

export const verifyEmailCode = async (requestBody) => {
  const url = '/certification/email/verify-code';
  const { data } = await apiClient.post(url, requestBody);
  return data;
};

export const postStudentIdVerification = async (image) => {
  const formData = new FormData();
  formData.append('image', processImageForUpload(image));
  const { data } = await apiClient.post('/certification/student-id-card', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const refreshStudentCertification = async () => {
  return await apiClient.put(`/certification/refresh`);
};
