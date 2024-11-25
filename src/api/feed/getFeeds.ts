import { apiClient } from "../apiClient";

export const getFeeds = async () => {
  return await apiClient.get(`/feeds?category=free`);
};
