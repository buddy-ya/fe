import { create } from 'zustand';
import { useUserStore } from './useUserStore';

export const studentCertCheckEnabled = false;

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
  | 'point'
  | 'banned'
  | 'noResponse';

export const modalRequiresCert: Record<ModalType, boolean> = {
  comment: false,
  feed: false,
  studentCertification: false,
  category: false,
  chatRequest: true,
  chat: false,
  myProfile: false,
  report: true,
  block: true,
  exit: false,
  matchRequest: true,
  point: false,
  banned: false,
  noResponse: false,
};

const certRequiredSet = new Set<ModalType>(
  (Object.keys(modalRequiresCert) as ModalType[]).filter((m) => modalRequiresCert[m])
);

interface ModalState {
  visible: Record<ModalType, boolean>;
  modalProps: Partial<Record<ModalType, any>>;
}

interface ModalAction {
  handleOpen: (type: ModalType, props?: any) => void;
  handleClose: (type: ModalType) => void;
}

export const useModalStore = create<ModalState & ModalAction>((set, get) => {
  const originalOpen = (type: ModalType, props: any = {}) => {
    set((state) => ({
      visible: { ...state.visible, [type]: true },
      modalProps: { ...state.modalProps, [type]: props },
    }));
  };

  return {
    visible: Object.fromEntries(
      (Object.keys(modalRequiresCert) as ModalType[]).map((key) => [key, false])
    ) as Record<ModalType, boolean>,

    modalProps: {},

    handleOpen: (type, props = {}) => {
      // 인증 체크가 비활성화이거나, 해당 모달이 체크 대상이 아니면 바로 열기
      if (!studentCertCheckEnabled || !certRequiredSet.has(type)) {
        return originalOpen(type, props);
      }
      // 인증이 필요한 모달이므로, 사용자 인증 여부 확인
      const isCert = useUserStore.getState().isCertificated;
      if (!isCert) {
        return originalOpen('studentCertification', props);
      }
      return originalOpen(type, props);
    },

    handleClose: (type) => {
      set((state) => ({
        visible: { ...state.visible, [type]: false },
        modalProps: { ...state.modalProps, [type]: {} },
      }));
    },
  };
});
