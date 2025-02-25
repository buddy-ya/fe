import { ChatSocketRepository } from '@/api';
import { Message } from '@/model';
import { useUserStore } from '@/store';
import { create } from 'zustand';

interface MessageStore {
  text: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  lastTempId: number;

  handleChange: (text: string) => void;
  sendMessage: (roomId: number) => Promise<void>;
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

    // 임시 메시지 id를 음수로 생성하여 서버 id와 충돌하지 않도록 함
    const tempId = lastTempId - 1;
    const tempMessage: Message = {
      id: tempId,
      sender: 'me',
      content: text,
      type: 'TALK',
      createdDate: new Date().toISOString(),
    };
    // 임시 메시지 추가 (Optimistic Update)
    set((state) => ({
      messages: [tempMessage, ...state.messages],
      lastTempId: tempId,
      text: '',
    }));

    try {
      // 서버에 메시지 전송 및 ack 응답 대기
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
      // 임시 메시지를 실제 메시지로 대체
      set((state) => ({
        messages: state.messages.map((msg) => (msg.id === tempId ? realMessage : msg)),
        isLoading: false,
      }));
    } catch (error: any) {
      // 전송 실패 시 임시 메시지 제거 및 에러 업데이트
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== tempId),
        isLoading: false,
        error: error.message || 'Message sending failed',
      }));
    }
  },

  setMessage: (messages) => set({ messages, isLoading: false }),

  addMessage: (message: Message) => set((state) => ({ messages: [message, ...state.messages] })),

  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
}));
