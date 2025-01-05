interface BaseDTO {
    feedId: number;
}

export interface CreateDTO extends BaseDTO {
    content: string;
}

export interface UpdateDTO extends BaseDTO {
    commentId: number;
    content: string;
}

export interface DeleteDTO extends BaseDTO {
    commentId: number;
}

export interface GetCommentsDTO extends BaseDTO { }

// Response DTO
export interface CommonResponse {
    id: number;
    content: string;
    name: string;
    country: string;
    university: string;
    profileImageURL: string;
    createdDate: string;
    updatedDate?: string;
    isFeedOwner: boolean;
    isCommentOwner: boolean
}

export interface UpdateResponse extends CommonResponse {
    updatedDate: string;
}