import { ChatListResponse, ChatDTO } from '@/types/ChatDTO';
import API from './API';

class ChatRepository {
  async getChats({ roomId, page = 0, size = 15 }: ChatDTO): Promise<ChatListResponse> {
    const { data } = await API.get(`/rooms/${roomId}/chats?page=${page}&size=${size}`);
    return data;
  }

  async sendImage({
    roomId,
    file,
    tempId,
  }: {
    roomId: number;
    file: any;
    tempId: number;
  }): Promise<{ status: string; chat: any }> {
    const image = new FormData();
    image.append('image', file);
    image.append('tempId', String(tempId));

    const { data } = await API.post(`/node/rooms/${roomId}/image`, image, {
      headers: {
        ...API.defaults.headers.common,
      },
    });
    return data;
  }
}

export default new ChatRepository();
