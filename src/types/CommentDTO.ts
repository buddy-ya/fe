export interface CommentDTO {
  feedId?: number;
  commentId?: number;
  parentId?: number;
  content?: string;
}

export interface Comment {
  id: number;
  userId: number;
  content: string;
  name: string;
  country: string;
  university: string;
  profileImageUrl: string;
  likeCount: number;
  createdDate: string;
  isDeleted: boolean;
  isLiked: boolean;
  isFeedOwner: boolean;
  isCommentOwner: boolean;
  isProfileImageUpload: boolean;
  isBlocked: boolean;
  isStudentDeleted: boolean;
  replies: Comment[];
}
