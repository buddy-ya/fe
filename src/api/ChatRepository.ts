import { ChatListResponse, ChatDTO } from '@/types/ChatDTO';
import API from './API';

class ChatRepository {
  async getChats({ roomId, page = 0, size = 15 }: ChatDTO): Promise<ChatListResponse> {
    const { data } = await API.get(`/rooms/${roomId}/chats?page=${page}&size=${size}`);
    return data;
  }
}

export default new ChatRepository();
