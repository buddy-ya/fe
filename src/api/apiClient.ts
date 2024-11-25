import axios from "axios";
import { BASE_URL } from "@env";
import {
  getRefreshToken,
  saveTokens,
  removeTokens,
  getAccessToken,
} from "@/utils/service/auth";
import { resetToOnboarding } from "@/navigation/router";
import { logError } from "@/utils/service/error";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const reissueTokens = async (refreshToken: string) => {
  const response = await axios({
    method: "post",
    url: `${BASE_URL}/auth/reissue`,
    data: { refreshToken },
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        const { accessToken, refreshToken: newRefreshToken } =
          await reissueTokens(refreshToken);
        await saveTokens(accessToken, newRefreshToken || refreshToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(error.config);
      } catch (reissueError) {
        await removeTokens();
        resetToOnboarding();
        logError(reissueError);
        return Promise.reject(reissueError);
      }
    }
    logError(error);
    return Promise.reject(error);
  }
);
