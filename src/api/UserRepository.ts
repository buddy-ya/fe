import { InvitationCodeDTO, ReportDTO, User } from '@/types';
import { getFormDataHeaders } from '@/utils';
import API from './API';

class UserRepository {
  async get({ id }: { id: number }): Promise<User> {
    const { data } = await API.get(`/users/${id}`);
    return data;
  }

  async getInvitationCode(): Promise<InvitationCodeDTO> {
    const { data } = await API.get(`/users/invitation-code`);
    return data;
  }

  async submitInvitaionCode({ code }: { code: string }): Promise<InvitationCodeDTO> {
    const { data } = await API.post(`/users/invitation-code`, { code });
    return data;
  }

  async create(dto: User): Promise<User> {
    const { data } = await API.post('/users', dto);
    return data;
  }

  async update({ key, values }: { key: string; values: string[] }): Promise<User> {
    const { data } = await API.patch(`/users`, { key, values });
    return data;
  }

  async updateProfileImage({
    isDefault,
    profileImage,
  }: {
    isDefault: boolean;
    profileImage: FormData | null;
  }): Promise<User> {
    let headers = getFormDataHeaders();
    if (profileImage == null) {
      headers = { ...API.defaults.headers.common };
    }
    const { data } = await API.patch(`/users/profile-image?isDefault=${isDefault}`, profileImage, {
      headers,
    });
    return data;
  }

  async getUniversities() {
    const { data } = await API.get('/users/universities');
    return data;
  }

  async report(dto: ReportDTO): Promise<void> {
    await API.post('/report', dto);
  }

  async block({ userId }: { userId: number }) {
    await API.post(`/users/block/${userId}`);
  }

  async logout() {
    const { data } = await API.post(`/users/logout`);
    return data;
  }

  async delete() {
    const { data } = await API.delete(`/users`);
    return data;
  }
}

export default new UserRepository();
