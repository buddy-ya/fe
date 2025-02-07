import { useUserStore } from '@/store';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { showErrorModal, TOKEN_KEYS } from '@/utils';

const BASE_URL = Constants?.expoConfig?.extra?.BASE_URL || '';
console.log(BASE_URL);

export const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const reissueToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: null }> => {
  const { data } = await axios.post(`${BASE_URL}/auth/reissue`, { refreshToken });
  return data;
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // TODO: 리액트 쿼리에서 기본 3회 재요청 때문에 모달이 3번 뜨는 현상이 있어 추후 주석 처리 필요해 보임
    if (!error.response) {
      showErrorModal('network');
      return Promise.reject(error);
    }
    const errorCode = error.response?.data?.code;
    if (error.response?.status === 401 && errorCode === 3002 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }
        const { accessToken } = await reissueToken(refreshToken);
        await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return API(error.config);
      } catch (reissueError) {
        await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
        await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
        delete API.defaults.headers.common['Authorization'];
        useUserStore.getState().init();
        showErrorModal('tokenExpired');
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
