type Gender = 'male' | 'female' | 'unknown' | null;

export interface User {
  id?: number;
  name?: string;
  country: string;
  university?: string;
  gender?: Gender;
  profileImageUrl?: string;
  phoneNumber?: string;
  majors?: string[];
  languages?: string[];
  interests?: string[];
  status?: string;
  isCertificated?: boolean;
  isStudentIdCardRequested?: boolean;
  isNotificationEnabled?: boolean;
  isAuthenticated?: boolean;
  isKorean?: boolean;
  accessToken?: string;
  refreshToken?: string;
}
