import { Feed } from "@/model";
import { ReactNode } from "react";

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