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
