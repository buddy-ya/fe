// useMessageStore.ts
// processImageForUpload와 ImageFile 인터페이스 포함
import { ChatSocketRepository } from '@/api';
import { MessageRequest, Message } from '@/model';
import { useUserStore } from '@/store';
import { create } from 'zustand';
import ChatRepository from '@/api/ChatRepository';
import { processImageForUpload } from '@/utils';

interface MessageStore {
  text: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  lastTempId: number;

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
  lastTempId: 0,

  handleChange: (text) => set({ text }),

  sendMessage: async (roomId: number) => {
    const { text, lastTempId } = get();
    if (!text.trim()) return;
    set({ isLoading: true, error: null });
    const tempId = lastTempId - 1;
    const tempMessage: Message = {
      id: tempId,
      sender: 'me',
      content: text,
      type: 'TALK',
      createdDate: new Date().toISOString(),
    };
    set((state) => ({
      messages: [tempMessage, ...state.messages],
      lastTempId: tempId,
      text: '',
    }));

    try {
      const ack = await ChatSocketRepository.sendMessage({
        type: 'TALK',
        roomId,
        tempId,
        message: text,
      });
      const currentUserId = useUserStore.getState().id;
      const realMessage: Message = {
        id: ack.chat.id,
        sender: ack.chat.senderId === currentUserId ? 'me' : ack.chat.senderId.toString(),
        content: ack.chat.message,
        type: ack.chat.type,
        createdDate: ack.chat.createdDate,
      };
      set((state) => ({
        messages: state.messages.map((msg) => (msg.id === tempId ? realMessage : msg)),
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== tempId),
        isLoading: false,
        error: error.message || 'Message sending failed',
      }));
    }
  },

  sendImageMessage: async (roomId: number, file: any) => {
    const { lastTempId } = get();
    set({ isLoading: true, error: null });
    const tempId = lastTempId - 1;
    const tempMessage: Message = {
      id: tempId,
      sender: 'me',
      content: '', // 임시 메시지 내용 (예: 로딩 상태 표시)
      type: 'IMAGE',
      createdDate: new Date().toISOString(),
    };

    set((state) => ({
      messages: [tempMessage, ...state.messages],
      lastTempId: tempId,
    }));

    try {
      const processedImage = processImageForUpload(file);
      const ack = await ChatRepository.sendImage({ roomId, file: processedImage, tempId });
      const currentUserId = useUserStore.getState().id;
      const imageUrl =
        ack.chat.message && ack.chat.message.trim() !== '' ? ack.chat.message : file.uri;
      const realMessage: Message = {
        id: ack.chat.id,
        sender: ack.chat.senderId === currentUserId ? 'me' : ack.chat.senderId.toString(),
        content: imageUrl,
        type: ack.chat.type,
        createdDate: ack.chat.createdDate,
      };
      set((state) => ({
        messages: state.messages.map((msg) => (msg.id === tempId ? realMessage : msg)),
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== tempId),
        isLoading: false,
        error: error.message || 'Image sending failed',
      }));
    }
  },

  setMessage: (messages) => set({ messages, isLoading: false }),
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
}));
