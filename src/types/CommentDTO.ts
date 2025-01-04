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