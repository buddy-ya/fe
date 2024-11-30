import { apiClient } from "../apiClient";

export const createComment = async (feedId: number, content: string) => {
  const { data } = await apiClient.post(`/feeds/${feedId}/comments`, {
    content,
  });
  return data;
};

export const updateComment = async (
  feedId: number,
  commentId: number,
  content: string
) => {
  return await apiClient.put(`/feeds/${feedId}/comments/${commentId}`, {
    content,
  });
};

export const deleteComment = async (feedId: number, commentId: number) => {
  return await apiClient.delete(`/feeds/${feedId}/comments/${commentId}`);
};
