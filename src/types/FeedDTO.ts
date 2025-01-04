import { FeedFormData } from "@/utils/service/formData";

interface BaseDTO {
    feedId: number;
}

interface SearchDTO {
    page?: number;
    size?: number;
}

export interface GetDTO extends BaseDTO { }

export interface GetAllDTO extends SearchDTO {
    category: string;
}

export interface CreateDTO {
    feedData: FeedFormData
}

export interface UpdateDTO extends BaseDTO {
    feedData: FeedFormData
}

export interface DeleteDTO extends BaseDTO { }

export interface SearchFeedsDTO extends SearchDTO {
    category: string;
    keyword: string;
}

export interface GetBookmarkedFeedsDTO extends SearchDTO { }

export interface GetMyPostsDTO extends SearchDTO { }

export interface ToggleDTO extends BaseDTO { }