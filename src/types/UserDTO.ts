type Gender = 'male' | 'female' | 'unknown' | null;

export interface createInfoDTO {
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