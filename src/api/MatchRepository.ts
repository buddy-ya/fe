import { DeleteMatchResponse, MatchDTO, MatchRequest } from '@/types';
import API from './API';

class MatchRepository {
  async getStatus(): Promise<MatchDTO> {
    const { data } = await API.get<MatchDTO>('/matches/status');
    return data;
  }

  async createMatchRequest(matchRequest: MatchRequest): Promise<MatchDTO> {
    const { data } = await API.post('/matches', matchRequest);
    return data;
  }

  async deleteMatchRequest(): Promise<DeleteMatchResponse> {
    const { data } = await API.delete('/matches');
    return data;
  }
}

export default new MatchRepository();
