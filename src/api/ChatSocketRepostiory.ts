// src/api/ChatSocketRepository.ts
import { MessageRequest } from '@/model';
import { Message } from '@/model';
import { TokenService } from '@/service';
import { useUserStore, useMessageStore } from '@/store';
import Constants from 'expo-constants';
import io, { Socket } from 'socket.io-client';

const BASE_DOMAIN = Constants?.expoConfig?.extra?.BASE_DOMAIN || '';

class ChatSocketRepository {
  private socket: Socket | null = null;
  private roomOutHandler: ((data: any) => void) | null = null;

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

    this.socket.on('connect', () => {});
    this.socket.on('connect_error', (err: any) => {
      console.error('WebSocket 연결 에러:', err);
    });

    // — 메시지 수신 핸들러: Optimistic UI 대체 + 디버깅 로그 —
    this.socket.on('message', (chat: any) => {
      const store = useMessageStore.getState();
      const currentUserId = useUserStore.getState().id;
      const existing = store.messages;

      const realMessage: Message = {
        id: chat.id,
        sender: chat.senderId === currentUserId ? 'me' : chat.senderId.toString(),
        content: chat.message,
        type: chat.type,
        createdDate: chat.createdDate,
        status: 'sent',
      };

      const idx = existing.findIndex((m) => m.id === chat.tempId);

      let updated: Message[];
      if (idx > -1) {
        updated = [...existing];
        updated[idx] = realMessage;
      } else {
        updated = [realMessage, ...existing];
      }
      store.setMessage(updated);
    });

    this.socket.on('roomOut', (data) => {
      this.roomOutHandler?.(data);
    });

    return this.socket;
  }

  roomIn(roomId: number): Promise<void> {
    if (!this.socket) return Promise.reject('Socket not initialized');
    return new Promise((resolve, reject) => {
      this.socket!.emit('room_in', { roomId }, (ack: any) =>
        ack.status === 'success' ? resolve() : reject('채팅방 입장 실패')
      );
    });
  }

  roomBack(roomId: number): Promise<void> {
    if (!this.socket) return Promise.reject('Socket not initialized');
    return new Promise((resolve, reject) => {
      this.socket!.emit('room_back', { roomId }, (ack: any) =>
        ack.status === 'success' ? resolve() : reject('뒤로가기 실패')
      );
    });
  }

  roomOut(roomId: number): Promise<void> {
    if (!this.socket) return Promise.reject('Socket not initialized');
    return new Promise((resolve, reject) => {
      this.socket!.emit('room_out', { roomId }, (ack: any) =>
        ack.status === 'success' ? resolve() : reject('채팅방 나가기 실패')
      );
    });
  }

  sendMessage(messageData: MessageRequest): Promise<{ chat: any }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error('Socket not initialized'));
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

  disconnectSocket(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new ChatSocketRepository();
