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
  private roomOutHandler: ((data: any) => void) | null = null;

  // 외부에서 roomOut 이벤트 발생 시 호출할 함수를 등록합니다.
  setRoomOutHandler(handler: (data: any) => void) {
    this.roomOutHandler = handler;
  }

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

    // 메시지 수신 이벤트 리스너 (채팅 메시지는 내부에서 useMessageStore 업데이트)
    this.socket.on('message', (chat: any) => {
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

    // roomOut 이벤트 수신 리스너: 외부에 등록된 콜백 호출
    this.socket.on('roomOut', (data) => {
      console.log('채팅방에서 사용자가 나갔습니다.', data);
      if (this.roomOutHandler) {
        this.roomOutHandler(data);
      }
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

  // roomOut emit: 채팅방 나가기 요청
  roomOut(roomId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject(new Error('Socket not initialized'));
      }
      this.socket.emit('room_out', { roomId }, (ack: { status: string }) => {
        if (ack.status === 'success') {
          console.log('채팅방 나가기 성공');
          resolve();
        } else {
          console.error('채팅방 나가기 실패');
          reject(new Error('채팅방 나가기 실패'));
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
