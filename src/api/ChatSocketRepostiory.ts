import { MessageRequest } from '@/model';
import { TokenService } from '@/service';
import { useUserStore, useMessageStore } from '@/store';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import io, { Socket } from 'socket.io-client';
import { showErrorModal, TOKEN_KEYS } from '@/utils';
import { reissueToken } from './API';

const BASE_DOMAIN = Constants?.expoConfig?.extra?.BASE_DOMAIN || '';

class ChatSocketRepository {
  private socket: Socket | null = null;

  async initialize(): Promise<Socket> {
    if (this.socket) return this.socket;
    const token = await TokenService.getAccessToken();
    this.socket = io(`wss://${BASE_DOMAIN}/chat`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket 연결 성공!', this.socket?.id);
    });

    this.socket.on('connect_error', async (err: any) => {
      console.error('WebSocket 연결 에러:', err);
      if (err.errorCode === 3002) {
        try {
          const refreshToken = await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
          if (!refreshToken) throw new Error('Refresh token not found');
          const { accessToken } = await reissueToken(refreshToken);
          await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS, accessToken);
          if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
          }
          await this.initialize();
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

    // 메시지 수신 이벤트 리스너
    this.socket.on('message', (chat: any) => {
      // chat은 서버에서 보내는 MessageResponse 형식입니다.
      const currentUserId = useUserStore.getState().id;
      const newMessage = {
        id: chat.id,
        sender: chat.senderId === currentUserId ? 'me' : chat.senderId.toString(),
        content: chat.message,
        type: chat.type,
        createdDate: chat.createdDate,
      };
      useMessageStore.getState().addMessage(newMessage);
      console.log('Received message:', newMessage);
    });

    return this.socket;
  }

  roomIn(roomId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject(new Error('Socket not initialized'));
      }
      this.socket.emit('room_in', { roomId }, (ack: { status: string }) => {
        if (ack.status === 'success') {
          resolve();
        } else {
          reject(new Error('채팅방 입장 실패'));
        }
      });
    });
  }

  roomBack(roomId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject(new Error('Socket not initialized'));
      }
      this.socket.emit('room_back', { roomId }, (ack: { status: string }) => {
        if (ack.status === 'success') {
          resolve();
        } else {
          reject(new Error('채팅방 뒤로가기 실패'));
        }
      });
    });
  }

  sendMessage(messageData: MessageRequest): Promise<{ chat: any }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject(new Error('Socket not initialized'));
      }
      this.socket.emit(
        'message',
        messageData,
        (ack: { status: string; chat?: any; message?: string }) => {
          if (ack.status === 'success' && ack.chat) {
            resolve({ chat: ack.chat });
          } else {
            reject(new Error(ack.message || 'Message sending failed'));
          }
        }
      );
    });
  }
}

export default new ChatSocketRepository();
