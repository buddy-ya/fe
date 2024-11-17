import { create } from "zustand";

interface OnboardingState {
  name: string;
  major: string;
  country: string;
  isKorean: boolean;
  isNotificationEnabled: boolean;
  phoneNumber: string;
  gender: string;
  university: string;
  languages: string[];
  interests: string[];
}

interface OnboardingActions {
  setName: (name: string) => void;
  setMajor: (major: string) => void;
  setCountry: (country: string) => void;
  setIsKorean: (isKorean: boolean) => void;
  setIsNotificationEnabled: (enabled: boolean) => void;
  setPhoneNumber: (phone: string) => void;
  setGender: (gender: string) => void;
  setUniversity: (university: string) => void;
  setLanguages: (languages: string[]) => void;
  setInterests: (interests: string[]) => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  name: "",
  major: "",
  country: "",
  isKorean: true,
  isNotificationEnabled: false,
  phoneNumber: "",
  gender: "",
  university: "",
  languages: [],
  interests: [],
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>(
  (set) => ({
    ...initialState,

    setName: (name) => set({ name }),
    setMajor: (major) => set({ major }),
    setCountry: (country) => set({ country }),
    setIsKorean: (isKorean) => set({ isKorean }),
    setIsNotificationEnabled: (enabled) =>
      set({ isNotificationEnabled: enabled }),
    setPhoneNumber: (phone) => set({ phoneNumber: phone }),
    setGender: (gender) => set({ gender }),
    setUniversity: (university) => set({ university }),
    setLanguages: (languages) => set({ languages }),
    setInterests: (interests) => set({ interests }),
    reset: () => set(initialState),
  })
);
