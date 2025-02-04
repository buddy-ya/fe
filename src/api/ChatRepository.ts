import { ChatRequest } from '@/types';
import API from './API';

const url = '/chat-requests';

class ChatRepository {
  async get({ receiverId }: { receiverId: number }): Promise<{
    isAlreadyExistChatRequest: boolean;
    isAlreadyExistChatroom: boolean;
  }> {
    const { data } = await API.get(`${url}/${receiverId}`);
    return data;
  }

  async getRequestList(): Promise<ChatRequest[]> {
    const { data } = await API.get(`${url}`);
    return data;
  }

  async create({ receiverId }: { receiverId: number }) {
    const { data } = await API.post(`${url}/${receiverId}`);
    return data;
  }

  async delete({ chatRequestId }: { chatRequestId: number }) {
    const { data } = await API.delete(`${url}/${chatRequestId}`);
    return data;
  }
}

export default new ChatRepository();
