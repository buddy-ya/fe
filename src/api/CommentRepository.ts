import API from "./API";
import { Comment } from "@/types";

class CommentRepository {

    // TODO: get 으로 바꿔도 될 듯?
    async getComments({ feedId }: Comment.GetCommentsDTO): Promise<Comment.CommmentResponse[]> {
        const { data } = await API.get(`/feeds/${feedId}/comments`);
        return data;
    };

    async create({ feedId, content }: Comment.CreateDTO): Promise<Comment.CommmentResponse> {
        const { data } = await API.post(`/feeds/${feedId}/comments`, {
            content,
        });
        return data;
    };

    async update({ feedId, commentId, content }: Comment.UpdateDTO): Promise<Comment.UpdateResponse> {
        const { data } = await API.patch(
            `/feeds/${feedId}/comments/${commentId}`,
            {
                content,
            }
        );
        return data;
    };

    async delete({ feedId, commentId }: Comment.DeleteDTO) {
        const { data } = await API.delete(`/feeds/${feedId}/comments/${commentId}`);
        return data;
    };
}

export default new CommentRepository();