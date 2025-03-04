import { create } from 'zustand';

type ModalType =
  | 'comment'
  | 'feed'
  | 'studentCertification'
  | 'category'
  | 'chatRequest'
  | 'chat'
  | 'myProfile'
  | 'report'
  | 'exit';

interface ModalState {
  visible: Record<ModalType, boolean>;
}

interface ModalAction {
  handleOpen: (type: ModalType) => void;
  handleClose: (type: ModalType) => void;
}

export const useModalStore = create<ModalState & ModalAction>((set) => ({
  visible: {
    comment: false,
    feed: false,
    studentCertification: false,
    category: false,
    chatRequest: false,
    chat: false,
    myProfile: false,
    report: false,
    exit: false,
  },
  handleOpen: (type) => set((state) => ({ visible: { ...state.visible, [type]: true } })),
  handleClose: (type) => set((state) => ({ visible: { ...state.visible, [type]: false } })),
}));
