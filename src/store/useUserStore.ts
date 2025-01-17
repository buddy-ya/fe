import { create } from "zustand";


type UpdateUserType = Partial<UserState>

interface UserState {
    isCertificated: boolean,
    isStudentIdCardRequested: boolean,
    isKorean: boolean
}

interface UserAction {
    update: ({ isCertificated, isStudentIdCardRequested, isKorean }: UpdateUserType) => void;
}

export const useUserStore = create<UserState & UserAction>((set) => ({
    isCertificated: false,
    isStudentIdCardRequested: false,
    isKorean: false,
    update: (user: UserState) => set((state) => ({ ...state, ...user }))
}));
