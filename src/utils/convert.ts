import { Comment, Feed, Room } from "@/model";
import { CommmentResponse } from "@/types/CommentDTO";

export const convertToUser = (response: CommmentResponse): Comment => {
    return {
        id: response.id,
        profileImageUrl: response.profileImageUrl,
        content: response.content,
        name: response.name,
        country: response.country,
        university: response.university,
        createdDate: response.createdDate,
        isFeedOwner: response.isFeedOwner,
        isCommentOwner: response.isCommentOwner
    }
}

export const converToFeed = (response: any): Feed => {
    return {
        id: response.id,
        name: response.name,
        university: response.university,
        country: response.country,
        title: response.title,
        content: response.content,
        profileImageUrl: response.profileImageUrl,
        imageUrls: response.imageUrls,
        likeCount: response.likeCount,
        commentCount: response.commentCount,
        isFeedOwner: response.isFeedOwner,
        isLiked: response.isLiked,
        isBookmarked: response.isBookmarked,
        createdDate: response.createdDate
    }
}

export const convertToRoom = (response: any): Room => {
    return {
        id: response.id,
        title: response.title,
        content: response.content,
        imageUrl: response.imageUrl,
        unreadCount: response.unreadCount,
        lastMessageDate: response.lastMessageDate
    }
}

