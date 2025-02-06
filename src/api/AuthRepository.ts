import {
  AuthResponse,
  CheckCertificatedResponse,
  EmailDTO,
  PhoneDTO,
  VerifyCodeResponse,
} from '@/types/AuthDTO';
import axios from 'axios';
import Constants from 'expo-constants';
import API from './API';

const BASE_URL = Constants?.expoConfig?.extra?.BASE_URL || '';

// 인증/인가 관련 API를 다루는 클래스
class AuthRepository {
  async sendCodeByPhone({ phoneNumber }: PhoneDTO): Promise<PhoneDTO> {
    const { data } = await API.post('/phone-auth/send-code', { phoneNumber });
    return data;
  }

  async verifyCodeByPhone({ phoneNumber, code }: PhoneDTO): Promise<VerifyCodeResponse> {
    const { data } = await API.post('/phone-auth/verify-code', { phoneNumber, code });
    return data;
  }

  async sendCodeByMail({ email }: EmailDTO): Promise<AuthResponse> {
    const { data } = await API.post('/certification/email/send', { email });
    return data;
  }

  async verifyCodeByMail({ email, code }: EmailDTO): Promise<AuthResponse> {
    const { data } = await API.post('/certification/email/verify-code', { email, code });
    return data;
  }

  async checkCertificated(): Promise<CheckCertificatedResponse> {
    const { data } = await API.get(`/certification`);
    return data;
  }

  async uploadStudentIdCard(formData: FormData): Promise<AuthResponse> {
    const { data } = await API.post('/certification/student-id-card', formData, {
      headers: {
        ...API.defaults.headers.common,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  async refreshStudentCertification() {
    const { data } = await API.put(`/certification/refresh`);
    return data;
  }

  async reissueToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: null }> {
    const { data } = await axios.post(`${BASE_URL}/auth/reissue`, { refreshToken });
    return data;
  }
}

export default new AuthRepository();
