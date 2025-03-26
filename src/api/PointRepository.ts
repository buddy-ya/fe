import { Feed, FeedDTO, FeedUpdateDTO } from '@/types/FeedDTO';
import { PointDTO, PointsResponseDTO } from '@/types/PointDTO';
import { createFeedFormData, FeedFormData, getFormDataHeaders } from '@/utils';
import API from './API';

class PointRepository {
  async get(): Promise<PointsResponseDTO> {
    const { data } = await API.get(`/points`);
    return data;
  }
}

export default new PointRepository();
