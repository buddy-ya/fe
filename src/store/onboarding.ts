// store/onboarding.ts
import { create } from "zustand";

type Gender = "male" | "female" | "unknown";

interface OnboardingStore {
  name: string;
  major: string[];
  country: string;
  isKorean: boolean;
  isNotificationEnabled: boolean;
  phoneNumber: string;
  gender: Gender;
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
  isKorean: false,
  isNotificationEnabled: false,
  phoneNumber: "",
  gender: "unknown",
  university: "",
  languages: [],
  interests: [],
  updateOnboardingData: (data) => set((state) => ({ ...state, ...data })),
}));
