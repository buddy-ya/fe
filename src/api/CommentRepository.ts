import { Comment } from '@/types';
import { CommentDTO } from '@/types/CommentDTO';
import API from './API';

class CommentRepository {
  // TODO: get 으로 바꿔도 될 듯?
  async getComments({ feedId }: CommentDTO): Promise<Comment[]> {
    const { data } = await API.get(`/feeds/${feedId}/comments`);
    return data;
  }

  async create({ feedId, parentId, content }: CommentDTO): Promise<Comment> {
    const { data } = await API.post(`/feeds/${feedId}/comments`, {
      parentId,
      content,
    });
    return data;
  }

  async update({ feedId, commentId, content }: CommentDTO): Promise<Comment> {
    const { data } = await API.patch(`/feeds/${feedId}/comments/${commentId}`, {
      content,
    });
    return data;
  }

  async delete({ feedId, commentId }: CommentDTO) {
    const { data } = await API.delete(`/feeds/${feedId}/comments/${commentId}`);
    return data;
  }

  async toggleLike({ feedId, commentId }: CommentDTO) {
    const { data } = await API.put(`/feeds/${feedId}/comments/${commentId}/like`);
    return data;
  }
}

export default new CommentRepository();
