import { Alert } from 'react-native';
import i18n from '@/i18n';
import { resetToOnboarding } from '@/navigation/navigationRef';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEYS } from '@/utils';

const BASE_URL = Constants?.expoConfig?.extra?.BASE_URL || '';

export const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const reissueTokens = async (refreshToken: string) => {
  const response = await API.post(`${BASE_URL}/auth/reissue`, { refreshToken });
  return response.data;
};

const showErrorModal = (messageKey: string) => {
  Alert.alert(
    i18n.t('error:title'),
    i18n.t(`error:${messageKey}`),
    [{ text: i18n.t('common:confirm'), style: 'default' }],
    { cancelable: true }
  );
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
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
        const { accessToken, refreshToken: newRefreshToken } = await reissueTokens(refreshToken);

        const finalRefreshToken = newRefreshToken || refreshToken;
        await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
        await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, finalRefreshToken);
        error.config.headers.common.Authorization = `Bearer ${accessToken}`;
        return API(error.config);
      } catch (reissueError) {
        await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
        await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
        delete API.defaults.headers.common['Authorization'];
        resetToOnboarding();
        showErrorModal('tokenExpired');
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
