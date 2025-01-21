export interface Comment {
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