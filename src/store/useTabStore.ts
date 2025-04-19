import { create } from 'zustand';

type TabType = 'myUni' | 'buddyya';

interface TabState {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
}

export const useTabStore = create<TabState>((set) => ({
  selectedTab: 'myUni',
  setSelectedTab: (tab) => set({ selectedTab: tab }),
}));
