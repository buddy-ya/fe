import { apiClient } from "./index";

interface OnboardingRequest {
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
}

export const postOnboardingInfo = async (data: OnboardingRequest) => {
  return await apiClient.post("/api/onboarding", data);
};
