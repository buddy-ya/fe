import { create } from "zustand";

interface CommentState {
    comment: any;
}

interface ModalAction {
    setComment: (comment: any) => void;
}

export const useCommentStore = create<CommentState & ModalAction>((set) => ({
    comment: {},
    setComment: (comment) => set(() => ({ comment }))
}));
