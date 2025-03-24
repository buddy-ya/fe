// useMatchStore.ts
import { MatchDTO, MatchStatusType } from '@/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface MatchState {
  matchData: MatchDTO | null;
  matchStatus: MatchStatusType;
  updateMatchData: (data: MatchDTO | null) => void;
  updateMatchStatus: (status: MatchStatusType) => void;
}

export const useMatchStore = create(
  immer<MatchState>((set) => ({
    matchData: null,
    matchStatus: 'not_requested',
    updateMatchData: (data) =>
      set((state) => {
        state.matchData = data;
        if (data) {
          state.matchStatus = data.matchStatus;
        }
      }),
    updateMatchStatus: (status) =>
      set((state) => {
        state.matchStatus = status;
        if (state.matchData) {
          state.matchData.matchStatus = status;
        }
      }),
  }))
);
