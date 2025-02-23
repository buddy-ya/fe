import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  icon: JSX.Element | null;
  text: string;
}

interface ToastAction {
  showToast: (icon: JSX.Element, text: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState & ToastAction>((set) => ({
  visible: false,
  icon: null,
  text: '',
  showToast: (icon, text) => set({ visible: true, icon, text }),
  hideToast: () => set({ visible: false, icon: null, text: '' }),
}));
