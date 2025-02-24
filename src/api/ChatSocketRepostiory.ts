import { useUserStore } from '@/store';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import io, { Socket } from 'socket.io-client';
import { showErrorModal, TOKEN_KEYS } from '@/utils';
import { reissueToken } from './API';

const BASE_DOMAIN = Constants?.expoConfig?.extra?.BASE_DOMAIN || '';

class ChatSocketRepository {
  private socket: Socket | null = null;

  async initialize(token: string): Promise<Socket> {
    if (this.socket) return this.socket;

    this.socket = io(`wss://${BASE_DOMAIN}/chat`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket 연결 성공!', this.socket?.id);
    });

    this.socket.on('connect_error', async (err: any) => {
      console.error('WebSocket 연결 에러:', err);
      if (err.errorCode === 3002) {
        try {
          const refreshToken = await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
          if (!refreshToken) {
            throw new Error('Refresh token not found');
          }
          const { accessToken } = await reissueToken(refreshToken);
          await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
          if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
          }
          await this.initialize(accessToken);
        } catch (reissueError) {
          await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
          await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
          delete axios.defaults.headers.common['Authorization'];
          useUserStore.getState().init();
          showErrorModal('tokenExpired');
          console.error('토큰 재발급 실패', reissueError);
        }
      }
    });
    return this.socket;
  }
}

export default new ChatSocketRepository();
