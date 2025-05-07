import { MissionStatusResponseDTO } from '@/types/MissionDTO';
import API from './API';

class MissionRepository {
  async get(): Promise<MissionStatusResponseDTO> {
    const { data } = await API.get('/missions');
    return data;
  }
}

export default new MissionRepository();
