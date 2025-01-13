import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';
import { Message } from '@/model';


// Zustand 스토어 타입 정의
interface MessageStore {
    messages: Message[];
    isLoading: boolean;
    error: string | null;

    // Actions
    get: () => Promise<void>;
    add: (message: Message) => void;
    delete: (id: number) => void;
}

// Zustand 스토어 생성
export const useMessageStore = create<MessageStore>()(
    devtools((set) => ({
        messages: [],
        isLoading: false,
        error: null,

        // 서버에서 메시지 가져오기
        get: async () => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.get('/api/messages'); // 메시지 목록 가져오기 API
                set({ messages: response.data, isLoading: false });
            } catch (err: any) {
                set({ error: err.message || 'Failed to fetch messages', isLoading: false });
            }
        },

        // 메시지 추가
        add: (message) => {
            set((state) => ({
                messages: [...state.messages, message],
            }));
        },

        // 메시지 삭제
        delete: (id) => {
            set((state) => ({
                messages: state.messages.filter((message) => message.id !== id),
            }));
        },
    }))
);
