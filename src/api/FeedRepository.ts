import { Feed, FeedDTO, FeedUpdateDTO } from '@/types/FeedDTO';
import { createFeedFormData, FeedFormData, getFormDataHeaders } from '@/utils';
import API from './API';

class FeedRepository {
  async get({ feedId }: FeedDTO): Promise<Feed> {
    const { data } = await API.get(`/feeds/${feedId}`);
    return data;
  }

  async getAll({ university, category, page, size }: FeedDTO) {
    const { data } = await API.get('/feeds', {
      params: {
        university,
        category,
        page,
        size,
      },
    });
    return data;
  }

  async create(feedData: FeedFormData) {
    const formData = createFeedFormData(feedData);
    const headers = getFormDataHeaders();
    const { data } = await API.post('/feeds', formData, { headers });
    return data;
  }

  async update({ feedId, ...feedData }: FeedUpdateDTO) {
    const formData = createFeedFormData(feedData);
    const headers = getFormDataHeaders();
    const { data } = await API.patch(`/feeds/${feedId}`, formData, { headers });
    return data;
  }

  async delete({ feedId }: FeedDTO) {
    const { data } = await API.delete(`/feeds/${feedId}`);
    return data;
  }

  async searchFeeds({ category, keyword, page, size }: FeedDTO) {
    const { data } = await API.get('/feeds', {
      params: {
        category,
        keyword,
        page,
        size,
      },
    });
    return data;
  }

  async getBookmarkedFeeds({ page, size }: FeedDTO) {
    const { data } = await API.get('/users/bookmark', {
      params: {
        page,
        size,
      },
    });
    return data;
  }

  async getMyPosts({ page, size }: FeedDTO) {
    const { data } = await API.get('/users/myfeed', {
      params: {
        page,
        size,
      },
    });
    return data;
  }

  async toggleLike({ feedId }: FeedDTO) {
    const { data } = await API.put(`/feeds/${feedId}/like`);
    return data;
  }

  async toggleBookmark({ feedId }: FeedDTO) {
    const { data } = await API.put(`/feeds/${feedId}/bookmark`);
    return data;
  }
}

export default new FeedRepository();
