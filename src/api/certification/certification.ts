import { logError } from "@/utils/service/error";
import { apiClient } from "../apiClient";

export const getIsCertificated = async () => {
  try {
    const { data } = await apiClient.get(`/certification`);
    return data;
  } catch (error) {
    logError(error);
  }
};

export const sendEmail = async (requestBody) => {
  const url = "/certification/email/send";
  try {
    await apiClient.post(url, requestBody);
  } catch (error) {
    logError(error);
  }
};

export const verifyEmailCode = async (requestBody) => {
  const url = "/certification/email/verify-code";
  const { data } = await apiClient.post(url, requestBody);
  return data;
};
