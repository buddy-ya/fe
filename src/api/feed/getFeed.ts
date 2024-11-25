export const getFeed = async (feedId: number) => {
  return await apiClient.get(`/feeds/${feedId}`);
};

export const getFeedComments = async (feedId: number) => {
  return await apiClient.get(`/feeds/${feedId}/comments`);
};
