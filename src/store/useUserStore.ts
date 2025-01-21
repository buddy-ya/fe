import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CountryID } from '@/utils';

type UpdateUserType = Partial<UserState>;
type Gender = 'male' | 'female' | 'unknown';

interface UserState {
  id: number;
  name: string;
  university: string;
  country: CountryID;
  gender: Gender;
  profileImageUrl: string;
  majors: string[];
  languages: string[];
  interests: string[];
  isCertificated: boolean;
  isStudentIdCardRequested: boolean;
  isKorean: boolean;
}

interface UserAction {
  update: ({ ...state }: UpdateUserType) => void;
}

export const useUserStore = create<UserState & UserAction>()(
  persist(
    (set) => ({
      id: 0,
      name: '',
      university: '',
      country: 'ko',
      gender: 'unknown',
      profileImageUrl: '',
      majors: [],
      languages: [],
      interests: [],
      isCertificated: false,
      isStudentIdCardRequested: false,
      isKorean: false,
      update: (user: UserState) => set((state) => ({ ...state, ...user })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
