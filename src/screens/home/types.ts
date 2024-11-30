import { ReactNode } from "react";

export interface Feed {
  id: number;
  name: string;
  university: string;
  country: string;
  title: string;
  content: string;
  profileImageUrl: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  isFeedOwner: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  createdDate: string;
}

export interface FeedListResponse {
  feeds: Feed[];
  hasNext: boolean;
  currentPage: number;
  pages: FeedListResponse[];
}

export interface CommentType {
  id: number;
  profileImageUrl: string;
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
  icon?: ReactNode;
}

export interface ImageFile {
  uri: string;
  type?: string;
  fileName?: string;
}
