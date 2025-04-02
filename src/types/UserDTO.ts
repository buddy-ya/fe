export type Gender = 'male' | 'female' | 'unknown' | null;

export type Role = 'STUDENT' | 'ADMIN';

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
  status?: string | null;
  isCertificated?: boolean;
  isStudentIdCardRequested?: boolean;
  isDefaultProfileImage?: boolean;
  isNotificationEnabled?: boolean;
  isAuthenticated?: boolean;
  isKorean?: boolean;
  isBanned?: boolean;
  banExpiration?: string;
  banReason?: string;
  point?: number;
  role?: Role;
  accessToken?: string;
  refreshToken?: string;
}

export interface ReportDTO {
  type: 'FEED' | 'COMMENT' | 'CHATROOM';
  reportedId: number;
  reportedUserId: number | undefined;
  reason: string;
}
