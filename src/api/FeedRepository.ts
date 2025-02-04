import { FeedDTO, FeedUpdateDTO } from '@/types/FeedDTO';
import { createFeedFormData, FeedFormData } from '@/utils';
import API from './API';

class FeedRepository {
  async get({ feedId }: FeedDTO) {
    const { data } = await API.get(`/feeds/${feedId}`);
    return data;
  }

  async getAll({ category, page, size }: FeedDTO) {
    const { data } = await API.get('/feeds', {
      params: {
        category,
        page,
        size,
      },
    });
    return data;
  }

  async create(feedData: FeedFormData) {
    const formData = createFeedFormData(feedData);
    const { data } = await API.post('/feeds', formData, {
      headers: {
        ...API.defaults.headers.common,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }

  async update({ feedId, ...feedData }: FeedUpdateDTO) {
    const formData = createFeedFormData(feedData);
    const { data } = await API.patch(`/feeds/${feedId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
    console.log(data);
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
