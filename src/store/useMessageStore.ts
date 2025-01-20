import { create } from 'zustand';
import { Message } from '@/model';


// Zustand 스토어 타입 정의
interface MessageStore {
    text: string;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    lastMessageId: number | null;

    // Actions
    handleChange: (text: string) => void;
    handleSubmit: () => void;
    setMessage: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    deleteMessage: (id: number) => void;
}

// Zustand 스토어 생성
export const useMessageStore = create<MessageStore>((set) => ({
    text: '',
    messages: [],
    isLoading: false,
    error: null,
    lastMessageId: 1000,

    handleChange: (text) => set({ text }),
    handleSubmit: () => set((state) => ({
        messages: [...state.messages, {
            id: state.lastMessageId += 1,
            sender: 'me',
            content: state.text
        }], text: ''
    })),
    setMessage: (messages) => set({ messages: messages, isLoading: false }),
    // 메시지 추가
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

    // 메시지 삭제
    deleteMessage: (id) => set((state) => ({ messages: state.messages.filter((message) => message.id !== id) })),
}));

