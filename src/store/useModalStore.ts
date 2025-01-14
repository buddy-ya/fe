import { create } from "zustand";

interface ModalState {
    visible: boolean;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
}

interface ModalAction {
    handleOpen: () => void;
    handleClose: () => void;
    handleConfirm: () => void;
    setTitle: (title: string) => void,
    setDescription: (description: string) => void,
    setCancelText: (text: string) => void,
    setConfirmText: (text: string) => void,
}

export const useConfirmModalStore = create<ModalState & ModalAction>((set) => ({
    // 초기 상태
    visible: false,
    title: '',
    description: '',
    cancelText: '취소',
    confirmText: '확인',
    size: 'default',
    position: 'center',

    handleOpen: () => set({ visible: true }),
    handleClose: () => set({ visible: false }),
    handleConfirm: () => { },

    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setCancelText: (cancelText) => set({ cancelText }),
    setConfirmText: (confirmText) => set({ confirmText }),
}));
