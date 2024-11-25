import { ReactNode } from "react";

export interface Feed {
  id: number;
  name: string;
  university: string;
  country: string;
  title: string;
  content: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  isFeedOwner: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  createdDate: string;
}

export interface FeedResponse {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  feeds: Feed[];
}

export interface CommentType {
  id: number;
  content: string;
  name: string;
  country: string;
  university: string;
  createdDate: string;
  isFeedOwner: boolean;
  isCommentOwner: boolean;
}

export interface ModalOption {
  label: string;
  onPress: () => void;
  color?: string;
  icon?: ReactNode | JSX.Element;
}
