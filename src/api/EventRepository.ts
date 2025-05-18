import { PointResponseDTO } from '@/types/PointDTO';
import API from './API';

class EventRepository {
  async applyCoupon(code: string): Promise<PointResponseDTO> {
    const { data } = await API.post(`/events/coupon`, { code });
    return data;
  }
}

export default new EventRepository();
