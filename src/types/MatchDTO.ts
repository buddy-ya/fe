export type MatchStatusType = 'not_requested' | 'pending' | 'success';

export interface MatchDTO {
  id: number | null;
  buddyId: number | null;
  name: string | null;
  country: string | null;
  university: string | null;
  profileImageUrl: string | null;
  matchStatus: MatchStatusType;
  isExited: boolean;
}
