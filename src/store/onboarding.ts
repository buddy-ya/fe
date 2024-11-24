// store/onboarding.ts
import { create } from "zustand";

type Gender = "male" | "female" | "unknown";

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
  updateOnboardingData: (
    data: Partial<Omit<OnboardingStore, "updateOnboardingData">>
  ) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  name: "",
  country: "",
  isKorean: false,
  isNotificationEnabled: false,
  phoneNumber: "",
  gender: "unknown",
  university: "",
  majors: [],
  languages: [],
  interests: [],
  updateOnboardingData: (data) => set((state) => ({ ...state, ...data })),
}));
