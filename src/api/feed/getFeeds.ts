import { apiClient } from "../apiClient";

export const getFeeds = async (params: {
  category: string;
  page?: number;
  size?: number;
}) => {
  const { data } = await apiClient.get("/feeds", { params });
  return data;
};

export const toggleLike = async (feedId: number) => {
  const { data } = await apiClient.put(`/feeds/${feedId}/like`);
  return data;
};

export const toggleBookmark = async (feedId: number) => {
  const { data } = await apiClient.put(`/feeds/${feedId}/bookmark`);
  return data;
};
