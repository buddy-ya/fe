import { MatchDTO } from '@/types';
import API from './API';

class MatchRepository {
  async getStatus(): Promise<MatchDTO> {
    const { data } = await API.get<MatchDTO>('/matches/status');
    return data;
  }

  async createMatchRequest(matchRequest): Promise<MatchDTO> {
    const { data } = await API.post('/matches', matchRequest);
    return data;
  }

  async deleteMatchRequest() {
    await API.delete('/matches');
  }
}

export default new MatchRepository();
