// src/store/useMessageStore.ts
import { ChatSocketRepository } from '@/api';
import { Message } from '@/model';
import { useUserStore } from '@/store';
import { create } from 'zustand';
import ChatRepository from '@/api/ChatRepository';
import { processImageForUpload } from '@/utils';

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
    const tempId = generateTempId();

    // 1) Optimistic UI
    set((state) => ({
      messages: [
        {
          id: tempId,
          sender: 'me',
          content: text,
          type: 'TALK',
          createdDate: new Date().toISOString(),
          status: 'pending',
        },
        ...state.messages,
      ],
      text: '',
    }));

    try {
      // 2) 서버 전송 (UI 업데이트는 socket 메시지 핸들러에서)
      await ChatSocketRepository.sendMessage({
        roomId,
        tempId,
        type: 'TALK',
        message: text,
      });
      set({ isLoading: false });
    } catch (error: any) {
      // 3) 실패 처리
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        ),
        isLoading: false,
        error: error.message,
      }));
    }
  },

  sendImageMessage: async (roomId: number, file: any) => {
    set({ isLoading: true, error: null });
    const tempId = generateTempId();
    set((state) => ({
      messages: [
        {
          id: tempId,
          sender: 'me',
          content: file.uri,
          type: 'IMAGE',
          createdDate: new Date().toISOString(),
          status: 'pending',
        },
        ...state.messages,
      ],
    }));
    try {
      const processedImage = processImageForUpload(file);
      const ack = await ChatRepository.sendImage({
        roomId,
        file: processedImage,
        tempId,
      });
      // Optimistic UI 교체는 socket 핸들러에서 동일 패턴으로 처리됩니다
      set({ isLoading: false });
    } catch (error: any) {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        ),
        isLoading: false,
        error: error.message,
      }));
    }
  },

  setMessage: (messages) => set({ messages, isLoading: false }),
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),
}));
