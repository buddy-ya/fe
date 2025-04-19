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
          Object.assign(state.matchData, data);
        } else {
          state.matchData = data as MatchDTO;
        }
      }),
  }))
);
