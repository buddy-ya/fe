import { create } from 'zustand';

export type ModalType =
  | 'comment'
  | 'feed'
  | 'studentCertification'
  | 'category'
  | 'chatRequest'
  | 'chat'
  | 'myProfile'
  | 'report'
  | 'block'
  | 'exit'
  | 'matchRequest'
  | 'point';

interface ModalState {
  visible: Record<ModalType, boolean>;
  modalProps: Partial<Record<ModalType, any>>;
}

interface ModalAction {
  handleOpen: (type: ModalType, props?: any) => void;
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
    block: false,
    exit: false,
    matchRequest: false,
    point: false,
  },
  modalProps: {},
  handleOpen: (type, props = {}) =>
    set((state) => ({
      visible: { ...state.visible, [type]: true },
      modalProps: { ...state.modalProps, [type]: props },
    })),
  handleClose: (type) =>
    set((state) => ({
      visible: { ...state.visible, [type]: false },
      modalProps: { ...state.modalProps, [type]: {} },
    })),
}));
