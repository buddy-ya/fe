import { create } from 'zustand';
import { Room } from '@/model';


// Zustand 스토어 타입 정의
interface State extends Room {

}

interface Action {
    setRoom: (room: Room) => void;
}

// Zustand 스토어 생성
export const useRoomStore = create<State & Action>((set) => ({
    id: -1,
    title: '',
    content: '',
    imageUrl: '',
    unreadCount: 0,
    lastMessageDate: '',

    setRoom: (room: Room) => set({ id: room.id, title: room.title, content: room.content, imageUrl: room.imageUrl, unreadCount: room.unreadCount, lastMessageDate: room.lastMessageDate })
}));

