import { MissionAttendanceResponseDTO, MissionStatusResponseDTO } from '@/types/MissionDTO';
import API from './API';

class MissionRepository {
  async get(): Promise<MissionStatusResponseDTO> {
    const { data } = await API.get('/missions');
    return data;
  }

  async attend(): Promise<MissionAttendanceResponseDTO> {
    const { data } = await API.post('/missions/attendance');
    return data;
  }
}

export default new MissionRepository();
