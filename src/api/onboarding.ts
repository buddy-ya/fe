import { apiClient } from "./index";

interface PhoneVerificationRequest {
  phoneNumber: string;
}

export const postPhoneVerification = async (data: PhoneVerificationRequest) => {
  return await apiClient.post("/phone-auth/send-code", data);
};

interface VerificationCodeRequest {
  phoneNumber: string;
  code: string;
}

export interface PhoneVerifyResponse {
  phoneNumber: string;
  status: "EXISTING_MEMBER" | "NEW_MEMBER";
  accessToken: string | null;
  refreshToken: string | null;
}

export const postPhoneVerifyCode = async (
  data: VerificationCodeRequest
): Promise<PhoneVerifyResponse> => {
  return await apiClient.post("/phone-auth/verify-code", data);
};

type Gender = "male" | "female" | "unknown";

interface OnboardingRequest {
  name: string;
  major: string;
  country: string;
  isKorean: boolean;
  isNotificationEnabled: boolean;
  phoneNumber: string;
  gender: Gender;
  university: string;
  languages: string[];
  interests: string[];
}

export const postOnboardingInfo = async (data: OnboardingRequest) => {
  return await apiClient.post("/onboarding", data);
};
