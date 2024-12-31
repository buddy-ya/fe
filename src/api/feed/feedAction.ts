import { apiClient } from "../apiClient";
import { FeedFormData, createFeedFormData } from "@/utils/service/formData";

export const createFeed = async (feedData: FeedFormData) => {
  const formData = createFeedFormData(feedData);

  return await apiClient.post("/feeds", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateFeed = async (feedId: number, feedData: FeedFormData) => {
  const formData = createFeedFormData(feedData);

  return await apiClient.patch(`/feeds/${feedId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteFeed = async (feedId: number) => {
  return await apiClient.delete(`/feeds/${feedId}`);
};
