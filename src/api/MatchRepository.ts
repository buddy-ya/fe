import { MatchDTO } from '@/types';
import API from './API';

class MatchRepository {
  async getStatus(): Promise<MatchDTO> {
    const { data } = await API.get<MatchDTO>('/matches/status');
    return data;
  }
}

export default new MatchRepository();
