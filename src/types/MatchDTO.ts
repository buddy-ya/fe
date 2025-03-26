export type MatchStatusType = 'not_requested' | 'pending' | 'success';

export interface MatchDTO {
  id: number | null;
  chatRoomId: number | null;
  buddyId: number | null;
  name: string | null;
  country: string | null;
  university: string | null;
  profileImageUrl: string | null;
  matchStatus: MatchStatusType;
  point?: number;
  pointChange?: number;
  isExited: boolean;
}

export interface MatchRequest {
  universityType: 'SAME' | 'DIFFERENT';
  genderType: 'MALE' | 'FEMALE' | 'ALL';
}

export interface DeleteMatchResponse {
  point: number;
  pointChange: number;
}
