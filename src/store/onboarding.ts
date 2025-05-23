import { create } from 'zustand';

type Gender = 'male' | 'female' | 'unknown' | null;

interface OnboardingStore {
  name: string;
  country: string;
  isKorean: boolean;
  isNotificationEnabled: boolean;
  phoneNumber: string;
  gender: Gender;
  university: string;
  majors: string[];
  languages: string[];
  interests: string[];
  expoToken: string | null;
  updateOnboardingData: (data: Partial<Omit<OnboardingStore, 'updateOnboardingData'>>) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  name: '',
  country: '',
  isKorean: false,
  isNotificationEnabled: false,
  phoneNumber: '',
  gender: null,
  university: '',
  majors: [],
  languages: [],
  interests: [],
  expoToken: null,
  updateOnboardingData: (data) => set((state) => ({ ...state, ...data })),
}));
