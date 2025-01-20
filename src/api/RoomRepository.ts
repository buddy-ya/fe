import { RoomDTO, RoomResponseDTO } from '@/types/RoomDTO';
import API from './API';

class RoomRepository {
  async get({ id }: RoomDTO): Promise<RoomResponseDTO> {
    const { data } = await API.get(`/chatrooms/${id}`);
    return data;
  }

  async getRoomList(): Promise<RoomResponseDTO[]> {
    const { data } = await API.get(`/chatrooms`);
    return data;
  }

  async create({ buddyId, feedId, feedName }: RoomDTO): Promise<RoomResponseDTO> {
    const { data } = await API.post('/chatrooms', { buddyId, feedId, feedName });
    return data;
  }

  async delete({ id }: RoomDTO): Promise<{ message: string }> {
    const { data } = await API.delete(`/chatrooms/${id}`);
    return data;
  }
}

export default new RoomRepository();
