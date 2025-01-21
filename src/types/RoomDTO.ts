export interface RoomDTO {
  id: number;
  buddyId?: string;
  feedId?: string;
  feedName?: string;
}

export interface RoomResponseDTO {
  id: number;
  name: string;
  buddyId?: number;
  buddyName?: number;
  lastMessage: string;
  unreadCount: number;
  profileImageUrl: string;
  lastMessageDate: string;
}
