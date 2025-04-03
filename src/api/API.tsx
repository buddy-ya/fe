import { Alert } from 'react-native';
import { MyText } from '@/components';
import i18n from '@/i18n';
import { useToastStore, useUserStore } from '@/store';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { logError, showErrorModal, TOKEN_KEYS } from '@/utils';

const BASE_URL = Constants?.expoConfig?.extra?.BASE_URL || '';

export const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const reissueToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: null }> => {
  const { data } = await axios.post(`${BASE_URL}/auth/reissue`, { refreshToken });
  return data;
};

const errorMapping: Record<number, { emoji: string; translationKey: string }> = {
  1005: { emoji: '📩', translationKey: 'common:toast.error.sendSMS' },
  2011: { emoji: '🚫', translationKey: 'feed:error.alreadyBlocked' },
  2013: { emoji: '🚫', translationKey: 'mypage:event.invitation.toast.notValidCode' },
  2014: { emoji: '🚫', translationKey: 'mypage:event.invitation.toast.alreadyJoined' },
  2015: { emoji: '🚫', translationKey: 'mypage:event.invitation.toast.notSelf' },
  4000: { emoji: '🗑️', translationKey: 'feed:error.deletedFeed' },
  4006: { emoji: '🗑️', translationKey: 'feed:error.deletedComment' },
  5004: { emoji: '📩', translationKey: 'feed:error.alreadyExistChatRequest' },
  5005: { emoji: '💬', translationKey: 'feed:error.alreadyExistChatroom' },
  6004: { emoji: '🙅‍♂️', translationKey: 'common:toast.error.matchProfile' },
  8001: { emoji: '🚫', translationKey: 'common:toast.error.alreadyReported' },
  10002: { emoji: '🪙', translationKey: 'common:toast.error.point' },
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      useToastStore.getState().showToast(<MyText>🌐</MyText>, i18n.t('common:toast.error.network'));
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
    } else {
      const errorInfo = errorMapping[errorCode];
      if (errorInfo) {
        useToastStore
          .getState()
          .showToast(<MyText>{errorInfo.emoji}</MyText>, i18n.t(errorInfo.translationKey), 2000);
      } else {
        useToastStore
          .getState()
          .showToast(<MyText>⚠️</MyText>, i18n.t('common:toast.error.unknown'), 2000);
      }
    }

    logError(error);
    return Promise.reject(error);
  }
);

export default API;
