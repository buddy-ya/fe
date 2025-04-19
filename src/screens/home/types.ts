import { ReactNode } from 'react';
import { Feed } from '@/types';

export interface FeedListResponse {
  feeds: Feed[];
  hasNext: boolean;
  currentPage: number;
  pages: FeedListResponse[];
}

export interface ModalOption {
  label: string;
  onPress: () => void;
  color?: string;
  icon: ReactNode;
}
