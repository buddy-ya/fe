export interface PhoneDTO {
  phoneNumber: string;
  code?: string;
  udId?: string | null;
}

export interface EmailDTO {
  email: string;
  code?: string;
}

export interface AuthResponse {
  success?: boolean;
  code?: number;
  message?: string;
  point?: number;
  pointChange?: number;
}

// Response DTO
export interface VerifyCodeResponse {
  phoneNumber?: string;
  email?: string;
  code?: string;
  status: string;
  accessToken: string;
  refreshToken: string;
}

export interface CheckCertificatedResponse {
  isCertificated: boolean;
  isStudentIdCardRequested: boolean;
  isKorean: boolean;
}

export interface GetStudentIdCardResponse {
  studentIdCardUrl: string;
  rejectionReason: string;
}
