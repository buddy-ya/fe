import { create } from "zustand";

interface OnboardingStore {
  name: string;
  major: string[];
  country: string;
  korean: boolean;
  notificationEnabled: boolean;
  phoneNumber: string;
  gender: string;
  university: string;
  languages: string[];
  interests: string[];
  updateOnboardingData: (
    data: Partial<Omit<OnboardingStore, "updateOnboardingData">>
  ) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  name: "",
  major: [],
  country: "",
  korean: false,
  notificationEnabled: false,
  phoneNumber: "",
  gender: "",
  university: "",
  languages: [],
  interests: [],
  updateOnboardingData: (data) => set((state) => ({ ...state, ...data })),
}));
