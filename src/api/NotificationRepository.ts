import { PhoneDTO } from '@/types/AuthDTO';
import API from './API';

// 인증/인가 관련 API를 다루는 클래스
class NotificationRepository {
  async registerToken({ token }: { token: string | null }): Promise<{ message: string }> {
    const { data } = await API.post('/notification/save-token', { token });
    return data;
  }
}

export default new NotificationRepository();
