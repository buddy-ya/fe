import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type UserState = {
  id: number;
  name: string;
  country: string;
  university: string;
  gender: string | null;
  profileImageUrl: string;
  phoneNumber?: string;
  majors: string[];
  languages: string[];
  interests: string[];
  status?: string;
  isCertificated: boolean;
  isStudentIdCardRequested: boolean;
  isKorean: boolean;
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
};

type UserAction = {
  update: (user: Partial<UserState>) => void; // Partial로 특정 필드만 업데이트 가능
};

export const useUserStore = create(
  immer<UserState & UserAction>((set) => ({
    id: -1,
    name: '',
    university: '',
    country: 'ko',
    gender: null,
    profileImageUrl: '',
    majors: [],
    languages: [],
    interests: [],
    isCertificated: false,
    isStudentIdCardRequested: false,
    isKorean: false,
    isAuthenticated: false,

    update: (user) =>
      set((state) => {
        Object.assign(state, user); // immer를 사용해 상태를 병합
      }),
  }))
);
