import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type ChatRoomState = {
  totalUnreadCount: number;
};

type ChatRoomAction = {
  setTotalUnreadCount: (count: number) => void;
};

const INITIAL_STATE: ChatRoomState = {
  totalUnreadCount: 0,
};

export const useChatRoomStore = create(
  immer<ChatRoomState & ChatRoomAction>((set) => ({
    ...INITIAL_STATE,
    setTotalUnreadCount: (count: number) =>
      set((state) => {
        state.totalUnreadCount = count;
      }),
  }))
);
