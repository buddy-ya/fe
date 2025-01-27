export interface RoomDTO {
  id?: number;
  buddyId?: number;
  feedId?: number;
  feedName?: string;
}

export interface Room {
  id: number;
  name?: string;
  buddyId?: number;
  buddyName?: number;
  country?: string;
  lastMessage?: string;
  unreadCount?: number;
  profileImageUrl?: string;
  lastMessageDate?: string;
  isNew?: boolean;
}
