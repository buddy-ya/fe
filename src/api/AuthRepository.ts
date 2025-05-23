import {
  AuthResponse,
  CheckCertificatedResponse,
  EmailDTO,
  GetStudentIdCardResponse,
  PhoneDTO,
  VerifyCodeResponse,
} from '@/types/AuthDTO';
import { getFormDataHeaders } from '@/utils';
import API from './API';

class AuthRepository {
  async sendCodeByPhone({ phoneNumber, udId }: PhoneDTO): Promise<PhoneDTO> {
    const { data } = await API.post('/phone-auth/send-code', { phoneNumber, udId });

    return data;
  }

  async checkTestAccount({
    phoneNumber,
  }: {
    phoneNumber: string;
  }): Promise<{ isTestAccount: boolean }> {
    const { data } = await API.post('/phone-auth/check-test-account', { phoneNumber });
    return data;
  }

  async verifyCodeByPhone({ phoneNumber, code, udId }: PhoneDTO): Promise<VerifyCodeResponse> {
    const { data } = await API.post('/phone-auth/verify-code', { phoneNumber, code, udId });
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

  async getStudentIdCard(): Promise<GetStudentIdCardResponse> {
    const { data } = await API.get('/certification/student-id-card');
    return data;
  }

  async uploadStudentIdCard(formData: FormData): Promise<AuthResponse> {
    const headers = getFormDataHeaders();
    const { data } = await API.post('/certification/student-id-card', formData, { headers });
    return data;
  }

  async refreshStudentCertification() {
    const { data } = await API.put(`/certification/refresh`);
    return data;
  }
}

export default new AuthRepository();
