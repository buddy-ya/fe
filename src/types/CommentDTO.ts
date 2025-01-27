export interface CommentDTO {
  feedId?: number;
  commentId?: number;
  content?: string;
}

export interface Comment {
  id?: number;
  userId?: number;
  content?: string;
  name?: string;
  country?: string;
  university?: string;
  profileImageUrl?: string;
  createdDate?: string;
  isFeedOwner?: boolean;
  isCommentOwner?: boolean;
  updateDate?: string;
}
