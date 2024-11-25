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

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const reissueTokens = async (refreshToken: string) => {
  const response = await axios.post(
    `${BASE_URL}/auth/reissue`,
    { refreshToken },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    logError(error);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw {
            response: {
              data: {
                code: 401,
                message: "리프레시 토큰이 없습니다.",
              },
            },
          };
        }
        const { accessToken, refreshToken: newRefreshToken } =
          await reissueTokens(refreshToken);

        await saveTokens(accessToken, newRefreshToken || refreshToken);
        console.log("어세스토큰 재발급 성공!");
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (reissueError) {
        await removeTokens();
        console.log("리프레시 토큰 만료 -> 로그아웃 됩니다!");
        resetToOnboarding();
        logError(reissueError);
        return Promise.reject(reissueError);
      }
    }
    logError(error);
    return Promise.reject(error);
  }
);
