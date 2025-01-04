import { apiClient } from '../apiClient';

export const getFeed = async (feedId: number) => {
  const { data } = await apiClient.get(`/feeds/${feedId}`);
  return data;
};

export const getFeedComments = async (feedId: number) => {
  const { data } = await apiClient.get(`/feeds/${feedId}/comments`);
  return data;
};
