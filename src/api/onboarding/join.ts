import { apiClient } from "../apiClient";

type Gender = "male" | "female" | "unknown";

interface OnboardingRequest {
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
}

export const postOnboardingInfo = async (data: OnboardingRequest) => {
  return await apiClient.post("/onboarding", data);
};
