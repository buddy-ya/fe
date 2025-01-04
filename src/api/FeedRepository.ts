import API from "./API";
import { createFeedFormData, FeedFormData } from "@/utils/service/formData";

class FeedRepository {

    async get(feedId: number) {
        const { data } = await API.get(`/feeds/${feedId}`);
        return data;
    };

    async getAll(params: {
        category: string;
        page?: number;
        size?: number;
    }) {
        const { data } = await API.get("/feeds", { params });
        return data;
    };

    async create(feedData: FeedFormData) {
        const formData = createFeedFormData(feedData);
        const { data } = await API.post("/feeds", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    };

    async update(feedId: number, feedData: FeedFormData) {
        const formData = createFeedFormData(feedData);

        return await API.patch(`/feeds/${feedId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    async delete(feedId: number) {
        return await API.delete(`/feeds/${feedId}`);
    };


    async searchFeeds(params: {
        category: string;
        keyword: string;
        page?: number;
        size?: number;
    }) {
        const { data } = await API.get("/feeds", { params });
        return data;
    };

    async getBookmarkedFeeds(params: {
        page?: number;
        size?: number;
    }) {
        const { data } = await API.get("/mypage/bookmark", { params });
        return data;
    };

    async getMyPosts(params: { page?: number; size?: number }) {
        const { data } = await API.get("/mypage/myfeed", { params });
        return data;
    };

    async toggleLike(feedId: number) {
        const { data } = await API.put(`/feeds/${feedId}/like`);
        return data;
    };

    async toggleBookmark(feedId: number) {
        const { data } = await API.put(`/feeds/${feedId}/bookmark`);
        return data;
    };
}

export default new FeedRepository();