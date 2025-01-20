export interface RoomDTO {
    roomId: number;
}

export interface RoomResponseDTO {
    roomId: number;
    chatroomName: string;
    unreadCount: number;
    buddyProfileImage: string;
    lastMessage: string;
    lastMessageTime: string;
}
