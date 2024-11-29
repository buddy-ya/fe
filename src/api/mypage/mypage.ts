import apiClient from "../apiClient";

export const getProfile = async () => {
  const { data } = await apiClient.get(`/mypage`);
  return data;
};
