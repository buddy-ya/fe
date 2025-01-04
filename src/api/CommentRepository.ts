import API from "./API";

class CommentRepository {

    async create(feedId: number, content: string) {
        const { data } = await API.post(`/feeds/${feedId}/comments`, {
            content,
        });
        return data;
    };

    async update(
        feedId: number,
        commentId: number,
        content: string
    ) {
        const { data } = await API.patch(
            `/feeds/${feedId}/comments/${commentId}`,
            {
                content,
            }
        );
        return data;
    };

    async delete(feedId: number, commentId: number) {
        return await API.delete(`/feeds/${feedId}/comments/${commentId}`);
    };

    async getCommentsByFeedId(feedId: number) {
        const { data } = await API.get(`/feeds/${feedId}/comments`);
        return data;
    };

}

export default new CommentRepository();