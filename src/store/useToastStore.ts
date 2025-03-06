import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  icon: JSX.Element | null;
  text: string;
  duration: number;
}

interface ToastAction {
  showToast: (icon: JSX.Element, text: string, duration?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState & ToastAction>((set) => ({
  visible: false,
  icon: null,
  text: '',
  duration: 1000, // 기본값
  showToast: (icon, text, duration = 1000) => set({ visible: true, icon, text, duration }),
  hideToast: () => set({ visible: false, icon: null, text: '', duration: 1000 }),
}));
