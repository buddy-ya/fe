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

export interface GetCommentsDTO extends BaseDTO {}

// Response DTO
export interface CommmentResponse {
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

export interface UpdateResponse extends CommmentResponse {
  updatedDate: string;
}
export interface CommonResponse {
  id: number;
  userId: number;
  content: string;
  name: string;
  country: string;
  university: string;
  profileImageUrl: string;
  createdDate: string;
  isFeedOwner: boolean;
  isCommentOwner: boolean;
}

export interface UpdateResponse extends CommonResponse {
  updatedDate: string;
}
