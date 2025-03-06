import { API } from '@/api';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEYS } from '../utils/constants';

export const TokenService = {
  async getAccessToken(): Promise<string | null> {
    const token = API.defaults.headers.common['Authorization'];
    if (typeof token === 'string') {
      return token.replace('Bearer ', '');
    }
    return SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
  },

  async setAccessToken(accessToken: string) {
    await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
    API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  },

  async save(accessToken: string, refreshToken: string | null) {
    await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
    API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    if (refreshToken) {
      await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, refreshToken);
    }
  },

  async remove() {
    await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
    await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
    delete API.defaults.headers.common['Authorization'];
  },

  async isTokenPresent() {
    const accessToken = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();
    return !!(accessToken && refreshToken);
  },
};
