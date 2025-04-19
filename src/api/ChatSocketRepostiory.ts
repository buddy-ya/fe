import { MessageRequest } from '@/model';
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

    this.socket.on('connect_error', async (err: any) => {
      console.error('WebSocket 연결 에러:', err);
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

  disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new ChatSocketRepository();
