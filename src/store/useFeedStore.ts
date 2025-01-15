import { create } from "zustand";

interface FeedState {
    currentFeedId: number;
}

interface ModalAction {
    onClick: (feedId: number) => void;
}

export const useFeedStore = create<FeedState & ModalAction>((set) => ({
    currentFeedId: -1,
    onClick: (feedId) => set(() => ({ currentFeedId: feedId }))
}));
