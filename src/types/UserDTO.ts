export type Gender = 'male' | 'female' | 'unknown' | null;

export type Role = 'STUDENT' | 'ADMIN' | 'OWNER';

export interface User {
  id?: number;
  name?: string;
  country?: string;
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
  introduction?: string;
  buddyActivity?: string;
  isMatchingProfileCompleted?: boolean;
  totalUnreadCount?: number;
  isMatchingActive?: boolean;
  isFeedActive?: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface ReportDTO {
  type: 'FEED' | 'COMMENT' | 'CHATROOM' | 'CHATROOM_NO_RESPONSE';
  reportedId: number;
  reportedUserId: number | undefined;
  reason: string;
}

export interface InvitationCodeDTO {
  code: string;
  participated: boolean;
  point?: number;
  pointChange?: number;
}
