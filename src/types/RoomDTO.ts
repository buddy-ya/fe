export interface RoomDTO {
  id?: number;
  buddyId?: number;
  feedId?: number;
  feedName?: string;
}

export interface Room {
  id: number;
  name?: string;
  buddyId: number;
  buddyName?: number;
  country: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  profileImageUrl?: string;
  isNew?: boolean;
  isBuddyExited?: true;
}

export interface RoomListResponse {
  rooms: Room[];
  totalUnreadCount: number;
  hasChatRequest: boolean;
}
