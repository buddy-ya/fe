import { Comment } from '@/types';
import { CommentDTO } from '@/types/CommentDTO';
import API from './API';

class CommentRepository {
  // TODO: get 으로 바꿔도 될 듯?
  async getComments({ feedId }: CommentDTO): Promise<Comment[]> {
    const { data } = await API.get(`/feeds/${feedId}/comments`);
    return data;
  }

  async create({ feedId, content }: CommentDTO): Promise<Comment> {
    const { data } = await API.post(`/feeds/${feedId}/comments`, {
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
}

export default new CommentRepository();
