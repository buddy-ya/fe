import { FeedFormData } from "@/utils/service/formData";

interface BaseDTO {
    feedId: number;
}

interface BaseSearchDTO {
    page?: number;
    size?: number;
}

export interface GetDTO extends BaseDTO { }

export interface GetAllDTO extends BaseSearchDTO {
    category: string;
}

export interface CreateDTO {
    feedData: FeedFormData
}

export interface UpdateDTO extends BaseDTO {
    feedData: FeedFormData
}

export interface DeleteDTO extends BaseDTO { }

export interface SearchFeedsDTO extends BaseSearchDTO {
    category: string;
    keyword: string;
}

export interface GetBookmarkedFeedsDTO extends BaseSearchDTO { }

export interface GetMyPostsDTO extends BaseSearchDTO { }

export interface ToggleLikeDTO extends BaseDTO { }

export interface ToggleBookmarkDTO extends BaseDTO { }