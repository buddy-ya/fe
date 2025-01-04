import API from "./API";
import { Comment } from "@/types";

class CommentRepository {

    async create({ feedId, content }: Comment.CreateDTO) {
        const { data } = await API.post(`/feeds/${feedId}/comments`, {
            content,
        });
        return data;
    };

    async update({ feedId, commentId, content }: Comment.UpdateDTO) {
        const { data } = await API.patch(
            `/feeds/${feedId}/comments/${commentId}`,
            {
                content,
            }
        );
        return data;
    };

    async delete({ feedId, commentId }: Comment.DeleteDTO) {
        return await API.delete(`/feeds/${feedId}/comments/${commentId}`);
    };

    async getCommentsByFeedId({ feedId }: Comment.GetCommentsDTO) {
        const { data } = await API.get(`/feeds/${feedId}/comments`);
        return data;
    };

}

export default new CommentRepository();