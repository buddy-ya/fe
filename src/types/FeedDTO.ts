import { FeedFormData, ImageFile } from '@/utils';

interface BaseDTO {
  feedId: number;
}

export interface UpdateDTO extends BaseDTO, FeedFormData {}

export interface FeedDTO {
  feedId?: number;
  category?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface FeedUpdateDTO {
  feedId: number;
  title: string;
  content: string;
  category: string;
  images?: ImageFile[];
}

// TODO: 나중에 필수 항목 아닌거 옵셔널로 하기
export interface Feed {
  id: number;
  category?: string;
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
