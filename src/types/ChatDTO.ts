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
