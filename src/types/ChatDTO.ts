import { COUNTRY_IDS } from '@/utils';

type CountryId = (typeof COUNTRY_IDS)[number];

export interface ChatRequest {
  id: number;
  senderId: number;
  university: string;
  name: string;
  country: CountryId;
  profileImageUrl: string;
  createdDate: string;
}

export interface ChatDTO {
  roomId: number;
  page?: number;
  size?: number;
}

export interface Chat {
  id: number;
  senderId: number;
  type: 'TALK' | 'IMAGE';
  message: string;
  createdDate: string;
}

export interface ChatListResponse {
  messages: Chat[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}
