export interface CommentDTO {
  feedId?: number;
  commentId?: number;
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
  isFeedOwner: boolean;
  isCommentOwner: boolean;
  isProfileImageUpload: boolean; 
  replies: Comment[]; 
}
