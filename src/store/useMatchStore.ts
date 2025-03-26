import { MatchDTO } from '@/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type MatchState = {
  matchData: MatchDTO | null;
  updateMatchData: (data: Partial<MatchDTO>) => void;
};

export const useMatchStore = create(
  immer<MatchState>((set) => ({
    matchData: null,
    updateMatchData: (data) =>
      set((state) => {
        if (state.matchData) {
          // 기존 matchData에 전달받은 데이터만 병합합니다.
          Object.assign(state.matchData, data);
        } else {
          // matchData가 없으면 새로 할당합니다.
          state.matchData = data as MatchDTO;
        }
      }),
  }))
);
