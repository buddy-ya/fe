type Gender = 'male' | 'female' | 'unknown' | null;

export interface User {
  id?: number;
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
