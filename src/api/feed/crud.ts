import { apiClient } from "../apiClient";

export const updateFeed = async (
  feedId: number,
  data: {
    title: string;
    content: string;
    category: string;
    images: File[];
  }
) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("category", data.category);
  data.images.forEach((image) => {
    formData.append("images", image);
  });

  return await apiClient.put(`/feeds/${feedId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteFeed = async (feedId: number) => {
  return await apiClient.delete(`/feeds/${feedId}`);
};
