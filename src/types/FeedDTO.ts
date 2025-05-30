import { FeedFormData, ImageFile } from '@/utils';

interface BaseDTO {
  feedId: number;
}

export interface UpdateDTO extends BaseDTO, FeedFormData {}

export interface FeedDTO {
  feedId?: number;
  category?: string;
  university?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface FeedUpdateDTO {
  feedId: number;
  title: string;
  content: string;
  category: string;
  university: string;
  isProfileVisible: boolean;
  images?: ImageFile[];
}

// TODO: 나중에 필수 항목 아닌거 옵셔널로 하기
export interface Feed {
  id: number;
  userId: number;
  universityTab: string;
  name: string;
  country?: string;
  title: string;
  content: string;
  university?: string;
  profileImageUrl?: string;
  category?: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isFeedOwner: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  isCertificated: boolean;
  isPinned: boolean;
  isProfileVisible: boolean;
  createdDate: string;
  isStudentDeleted: boolean;
}
