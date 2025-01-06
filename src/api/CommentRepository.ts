import API from "./API";
import { Comment } from "@/types";

class CommentRepository {

    async create({ feedId, content }: Comment.CreateDTO): Promise<Comment.CommonResponse> {
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

    async getCommentsByFeedId({ feedId }: Comment.GetCommentsDTO): Promise<Comment.CommonResponse[]> {
        const { data } = await API.get(`/feeds/${feedId}/comments`);
        // TODO: 추후 백엔드에서 comments 빼고 주게끔 수정 필요
        return data.comments;
    };

}

export default new CommentRepository();