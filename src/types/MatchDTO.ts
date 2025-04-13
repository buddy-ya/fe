import { Gender } from './UserDTO';

export type MatchStatusType = 'not_requested' | 'pending' | 'success';

export interface MatchDTO {
  id: number | null;
  chatRoomId: number | null;
  buddyId: number | null;
  name: string | null;
  country: string | null;
  university: string | null;
  gender: Gender | null;
  profileImageUrl: string | null;
  majors: string[] | null;
  languages: string[] | null;
  interests: string[] | null;
  matchStatus: MatchStatusType;
  point?: number;
  pointChange?: number;
  introduction?: string;
  buddyActivity?: string;
  isExited: boolean;
}

export interface MatchRequest {
  nationalityType: 'KOREAN' | 'GLOBAL';
  universityType: 'SAME' | 'DIFFERENT';
  genderType: 'MALE' | 'FEMALE' | 'ALL';
}

export interface DeleteMatchResponse {
  point: number;
  pointChange: number;
}
