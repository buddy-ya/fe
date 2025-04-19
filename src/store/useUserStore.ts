import { Role } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 사용자 상태 정의
export type UserState = {
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
  isBanned?: boolean;
  banExpiration?: string;
  banReason?: string;
  point: number;
  role: Role;
  introduction?: string;
  buddyActivity?: string;
  isMatchingProfileCompleted?: boolean;
  accessToken?: string;
  refreshToken?: string;
  hydrated: boolean; // Persist rehydration 완료 플래그
};

// 사용자 액션 정의
export type UserAction = {
  init: () => void;
  update: (user: Partial<UserState>) => void;
  setHydrated: () => void;
};

// 초기 상태
const INITIAL_STATE: UserState = {
  id: -1,
  name: '',
  country: 'ko',
  university: '',
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
  point: 0,
  role: 'STUDENT',
  hydrated: false,
};

// Zustand 스토어 생성
export const useUserStore = create<UserState & UserAction>()(
  persist(
    immer((set) => ({
      ...INITIAL_STATE,
      // 부분 업데이트
      update: (user) => set((state) => Object.assign(state, user)),
      // 초기화
      init: () => set((state) => Object.assign(state, INITIAL_STATE)),
      // 리하이드레이트 완료 플래그 설정
      setHydrated: () => set({ hydrated: true }),
    })),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log('🟢 [useUserStore] rehydration complete at');
        state?.setHydrated();
      },
    }
  )
);
