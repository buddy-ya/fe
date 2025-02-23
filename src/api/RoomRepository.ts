import { Room, RoomDTO } from '@/types/RoomDTO';
import API from './API';

class RoomRepository {
  async get({ id }: RoomDTO): Promise<Room> {
    const { data } = await API.get(`/rooms/${id}`);
    return data;
  }

  async getRoomList(): Promise<Room[]> {
    const { data } = await API.get(`/rooms`);
    return data;
  }

  async delete({ id }: RoomDTO): Promise<{ message: string }> {
    const { data } = await API.delete(`/rooms/${id}`);
    return data;
  }
}

export default new RoomRepository();
