import { ReactNode } from "react";
import { create } from "zustand";

// BottomSheet 비슷한 모달이고, 옵션을 고르는 모달임.
interface ModalOption {
    label: string;
    icon: ReactNode;
    onPress: () => void;
}

interface ModalState {
    visible: boolean;
    optionList: ModalOption[]
}

interface ModalAction {
    handleOpen: () => void;
    handleClose: () => void;
}

export const useBottomModalStore = create<ModalState & ModalAction>((set) => ({
    // 초기 상태
    visible: false,
    optionList: [],
    handleOpen: () => set({ visible: true }),
    handleClose: () => set({ visible: false }),
    handleSet: (options: ModalOption[]) => set((state) => ({ optionList: [...options] })),

}));
