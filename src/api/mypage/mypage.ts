import apiClient from '../apiClient';

export const getProfile = async () => {
  const { data } = await apiClient.get(`/mypage`);
  return data;
};

export const updateName = async (name: string) => {
  return await apiClient.patch(`/mypage/update/name`, { name });
};

export const updateLanguages = async (languages: string[]) => {
  return await apiClient.patch(`/mypage/update/languages`, { languages });
};

export const updateInterests = async (interests: string[]) => {
  return await apiClient.patch(`/mypage/update/interests`, { interests });
};

export const updateProfileImage = async (imageKey: string) => {
  return await apiClient.patch(`/mypage/update/profile-default-image?profileImageKey=${imageKey}`);
};

export const deleteAccount = async () => {
  return await apiClient.delete(`/mypage/delete`);
};
