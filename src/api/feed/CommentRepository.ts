import apiClient from "../apiClient";

class CommentRepository {

    async create(feedId: number, content: string) {
        const { data } = await apiClient.post(`/feeds/${feedId}/comments`, {
            content,
        });
        return data;
    };

    async update(
        feedId: number,
        commentId: number,
        content: string
    ) {
        const { data } = await apiClient.patch(
            `/feeds/${feedId}/comments/${commentId}`,
            {
                content,
            }
        );
        return data;
    };

    async delete(feedId: number, commentId: number) {
        return await apiClient.delete(`/feeds/${feedId}/comments/${commentId}`);
    };

    async getCommentsByFeedId(feedId: number) {
        const { data } = await apiClient.get(`/feeds/${feedId}/comments`);
        return data;
    };

}

export default new CommentRepository();