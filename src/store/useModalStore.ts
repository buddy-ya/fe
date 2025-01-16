import { create } from "zustand";

type ModalType = keyof ModalState["visible"]

interface ModalState {
    visible: {
        comment: boolean,
        feed: boolean,
        studentCertification: boolean,
        category: boolean,
    }
}

interface ModalAction {
    handleOpen: (type: ModalType) => void;
    handleClose: (type: ModalType) => void;
}

export const useModalStore = create<ModalState & ModalAction>((set) => ({
    // 초기 상태
    visible: {
        comment: false,
        feed: false,
        studentCertification: false,
        category: false,
    },
    handleOpen: (type) => set((state) => ({ visible: { ...state.visible, [type]: true } })),
    handleClose: (type) => set((state) => ({ visible: { ...state.visible, [type]: false } })),
}));
