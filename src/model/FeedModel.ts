
export interface Feed {
    id: number;
    name: string;
    university: string;
    country: string;
    title: string;
    content: string;
    profileImageUrl: string;
    imageUrls: string[];
    likeCount: number;
    commentCount: number;
    isFeedOwner: boolean;
    isLiked: boolean;
    isBookmarked: boolean;
    createdDate: string;
}
