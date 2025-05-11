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

    this.socket.on('connect', () => {
      console.log('WebSocket 연결 성공!', this.socket?.id);
    });
    this.socket.on('connect_error', (err: any) => {
      console.error('WebSocket 연결 에러:', err);
    });

    // — 메시지 수신 핸들러: Optimistic UI 대체 + 디버깅 로그 —
    this.socket.on('message', (chat: any) => {
      console.log('⚡ broadcast received:', chat);

      const store = useMessageStore.getState();
      const currentUserId = useUserStore.getState().id;
      const existing = store.messages;
      console.log(
        'existing IDs:',
        existing.map((m) => m.id)
      );

      const realMessage: Message = {
        id: chat.id,
        sender: chat.senderId === currentUserId ? 'me' : chat.senderId.toString(),
        content: chat.message,
        type: chat.type,
        createdDate: chat.createdDate,
        status: 'sent',
      };

      // 1) Optimistic 메시지 위치 찾기
      const idx = existing.findIndex((m) => m.id === chat.tempId);
      console.log('findIndex for tempId', chat.tempId, ':', idx);

      let updated: Message[];
      if (idx > -1) {
        // 교체
        updated = [...existing];
        updated[idx] = realMessage;
        console.log(
          'Replaced pending with real. updated IDs:',
          updated.map((m) => m.id)
        );
      } else {
        // prepend
        updated = [realMessage, ...existing];
        console.log(
          'Prepended new message. updated IDs:',
          updated.map((m) => m.id)
        );
      }

      store.setMessage(updated);
      console.log(
        'After setMessage, store.messages IDs:',
        useMessageStore.getState().messages.map((m) => m.id)
      );
    });
    // — 핸들러 끝 —

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
    console.log("▶ emit 'message' 시도:", messageData);
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error('Socket not initialized'));
      this.socket.emit(
        'message',
        messageData,
        (ack: { status: string; chat?: any; message?: string }) => {
          console.log('◀ server ack:', ack);
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
