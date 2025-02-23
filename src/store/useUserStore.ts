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
  isDefaultProfileImage: boolean;
  isKorean: boolean;
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
};

type UserAction = {
  init: () => void;
  update: (user: Partial<UserState>) => void; // Partial로 특정 필드만 업데이트 가능
};

const INITIAL_STATE: UserState = {
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
  isDefaultProfileImage: false,
  isKorean: false,
  isAuthenticated: false,
};

export const useUserStore = create(
  immer<UserState & UserAction>((set) => ({
    ...INITIAL_STATE,
    update: (user) =>
      set((state) => {
        Object.assign(state, user); // immer를 사용해 상태를 병합
      }),
    init: () => {
      set((state) => {
        Object.assign(state, INITIAL_STATE);
      });
    },
  }))
);
