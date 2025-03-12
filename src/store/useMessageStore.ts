import { ChatSocketRepository } from '@/api';
import { Message } from '@/model';
import { useToastStore, useUserStore } from '@/store';
import { create } from 'zustand';
import ChatRepository from '@/api/ChatRepository';
import { processImageForUpload } from '@/utils';

// 고유한 임시 id를 생성하는 함수
const generateTempId = (): number => -(Date.now() + Math.floor(Math.random() * 1000));

interface MessageStore {
  text: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  handleChange: (text: string) => void;
  sendMessage: (roomId: number) => Promise<void>;
  sendImageMessage: (roomId: number, file: any) => Promise<void>;
  setMessage: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  deleteMessage: (id: number) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  text: '',
  messages: [],
  isLoading: false,
  error: null,

  handleChange: (text) => set({ text }),

  sendMessage: async (roomId: number) => {
    const { text } = get();
    if (!text.trim()) return;

    set({ isLoading: true, error: null });
    // 고유한 임시 메시지 id 생성
    const tempId = generateTempId();
    const tempMessage: Message = {
      id: tempId,
      sender: 'me',
      content: text,
      type: 'TALK',
      createdDate: new Date().toISOString(),
      status: 'pending',
    };

    // 임시 메시지 추가 및 텍스트 초기화
    set((state) => ({
      messages: [tempMessage, ...state.messages],
      text: '',
    }));

    try {
      const ack = await ChatSocketRepository.sendMessage({
        type: 'TALK',
        roomId,
        tempId, // number 타입의 고유 id 사용
        message: text,
      });

      const currentUserId = useUserStore.getState().id;
      const realMessage: Message = {
        id: ack.chat.id, // 실제 id (양수)
        sender: ack.chat.senderId === currentUserId ? 'me' : ack.chat.senderId.toString(),
        content: ack.chat.message,
        type: ack.chat.type,
        createdDate: ack.chat.createdDate,
        status: 'sent',
      };

      // 임시 메시지를 실제 메시지로 대체
      set((state) => ({
        messages: state.messages.map((msg) => (msg.id === tempId ? realMessage : msg)),
        isLoading: false,
      }));
    } catch (error: any) {
      // 전송 실패 시, 상태를 'failed'로 업데이트
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        ),
        isLoading: false,
        error: error.message || 'Message sending failed',
      }));
    }
  },

  sendImageMessage: async (roomId: number, file: any) => {
    set({ isLoading: true, error: null });
    const tempId = generateTempId();
    const tempMessage: Message = {
      id: tempId,
      sender: 'me',
      content: '',
      type: 'IMAGE',
      createdDate: new Date().toISOString(),
      status: 'pending',
    };

    set((state) => ({
      messages: [tempMessage, ...state.messages],
    }));

    try {
      const processedImage = await processImageForUpload(file);
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(300);
      const ack = await ChatRepository.sendImage({
        roomId,
        file: processedImage,
        tempId,
      });
      const currentUserId = useUserStore.getState().id;
      const imageUrl =
        ack.chat.message && ack.chat.message.trim() !== '' ? ack.chat.message : file.uri;

      const realMessage: Message = {
        id: ack.chat.id,
        sender: ack.chat.senderId === currentUserId ? 'me' : ack.chat.senderId.toString(),
        content: imageUrl,
        type: ack.chat.type,
        createdDate: ack.chat.createdDate,
        status: 'sent',
      };

      set((state) => ({
        messages: state.messages.map((msg) => (msg.id === tempId ? realMessage : msg)),
        isLoading: false,
      }));
    } catch (error: any) {
      const debugMessage: Message = {
        id: generateTempId(),
        sender: 'system',
        content: (error.message as string) || 'Image sending failed',
        type: 'SYSTEM',
        createdDate: new Date().toISOString(),
        status: 'failed',
      };

      set(
        (state) =>
          ({
            messages: [
              ...state.messages.map((msg) =>
                msg.id === tempId ? { ...msg, status: 'failed' } : msg
              ),
              debugMessage,
            ],
            isLoading: false,
            error: (error.response.data.message as string) || 'Image sending failed',
          }) as Partial<MessageStore>
      );
    }
  },

  setMessage: (messages) => set({ messages, isLoading: false }),

  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),

  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
}));
