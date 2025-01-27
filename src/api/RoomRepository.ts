import { Room, RoomDTO } from '@/types/RoomDTO';
import API from './API';

class RoomRepository {
  async get({ id }: RoomDTO): Promise<Room> {
    const { data } = await API.get(`/chatrooms/${id}`);
    return data;
  }

  async getRoomList(): Promise<Room[]> {
    const { data } = await API.get(`/chatrooms`);
    return data;
  }

  async create({ buddyId }: RoomDTO): Promise<Room> {
    const { data } = await API.post('/chatrooms', { buddyId });
    return data;
  }

  async delete({ id }: RoomDTO): Promise<{ message: string }> {
    const { data } = await API.delete(`/chatrooms/${id}`);
    return data;
  }
}

export default new RoomRepository();
